import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity.js';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateTransferDto } from './dtos/create-transfer.dto.js';
import { Account } from '../account/entities/account.entity.js';
import { TransferStatus } from './enums/transfer-status.enum.js';
import { PaginationDto } from './dtos/pagination.dto.js';

@Injectable()
export class TransferService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Transfer)
    private transferRepository: Repository<Transfer>,
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async transfer(dto: CreateTransferDto) {
    const { senderPhone, receiverPhone, amount } = dto;

    if (senderPhone === receiverPhone)
      throw new BadRequestException('Sender and receiver cannot be the same');

    const [sender, receiver] = await Promise.all([
      this.accountRepository.findOne({ where: { phoneNumber: senderPhone } }),
      this.accountRepository.findOne({ where: { phoneNumber: receiverPhone } }),
    ]);

    if (!sender)
      throw new NotFoundException(`No account found for ${senderPhone}`);

    if (!receiver)
      throw new NotFoundException(`No account found for ${receiverPhone}`);

    const transfer = this.transferRepository.create({
      senderId: sender.id,
      receiverId: receiver.id,
      amount,
      status: TransferStatus.Pending,
    });

    await this.transferRepository.save(transfer);

    try {
      const result = await this.dataSource.transaction(
        async (manager: EntityManager) => {
          const [firstId, secondId] =
            sender.id < receiver.id
              ? [sender.id, receiver.id]
              : [receiver.id, sender.id];

          const firstLocked = await manager.findOne(Account, {
            where: { id: firstId },
            lock: { mode: 'pessimistic_write' },
          });

          const secondLocked = await manager.findOne(Account, {
            where: { id: secondId },
            lock: { mode: 'pessimistic_write' },
          });

          const lockedSender = firstId === sender.id ? firstLocked : secondLocked;
          const lockedReceiver =
            firstId === sender.id ? secondLocked : firstLocked;

          if (!lockedSender || !lockedReceiver) {
            throw new NotFoundException('Account was deleted during transfer');
          }

          if (Number(lockedSender.balance) < amount)
            throw new BadRequestException('Insufficient balance');

          lockedSender.balance = Number(lockedSender.balance) - amount;
          lockedReceiver.balance = Number(lockedReceiver.balance) + amount;

          await manager.save(Account, lockedSender);
          await manager.save(Account, lockedReceiver);

          transfer.status = TransferStatus.Fulfilled;

          return manager.save(Transfer, transfer);
        },
      );

      return result;
    } catch (error) {
      transfer.status = TransferStatus.Failed;
      await this.transferRepository.save(transfer);
      throw error;
    }
  }

  async getAllTransfers(dto: PaginationDto) {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.transferRepository.findAndCount({
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
      },
      relations: {
        sender: true,
        receiver: true,
      },
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }
}

import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity.js';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto.js';
import { AddBalanceDto } from './dtos/add-balance.dto.js';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  async createAccount(dto: CreateAccountDto): Promise<Account> {
    const existingAcc = await this.accountRepository.findOne({
      where: { phoneNumber: dto.phoneNumber },
    });

    if (existingAcc)
      throw new ConflictException(
        'Account with this phone number already exists',
      );

    const acc = this.accountRepository.create(dto);
    return this.accountRepository.save(acc);
  }

  async getAccountByPhone(phoneNumber: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { phoneNumber },
    });
    if (!account) {
      throw new NotFoundException(
        `Account with phone number ${phoneNumber} not found`,
      );
    }
    return account;
  }

  async addBalance(dto: AddBalanceDto) {
    const result = await this.accountRepository.increment(
      { phoneNumber: dto.phoneNumber },
      'balance',
      dto.amount,
    );

    if (result.affected === 0) {
      throw new NotFoundException(
        `Account with phone number ${dto.phoneNumber} does not exist`,
      );
    }

    return this.getAccountByPhone(dto.phoneNumber);
  }

  async deleteAccount(id: string) {
    const result = await this.accountRepository.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(
        `Account with ID ${id} does not exist`,
    );
  }
}

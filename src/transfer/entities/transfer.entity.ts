import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransferStatus } from '../enums/transfer-status.enum.js';
import { Account } from '../../account/entities/account.entity.js';

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount: number;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'uuid' })
  receiverId: string;

  @Column({
    type: 'enum',
    enum: TransferStatus,
    default: TransferStatus.Pending,
  })
  status: TransferStatus;

  @ManyToOne(() => Account, (account) => account.outgoingTransfers, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'senderId' })
  sender: Account;

  @ManyToOne(() => Account, (account) => account.incomingTransfers, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'receiverId' })
  receiver: Account;
}

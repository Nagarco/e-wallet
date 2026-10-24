import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Transfer } from '../../transfer/entities/transfer.entity.js';

@Entity()
@Check(`"balance" >= 0`)
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  phoneNumber: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  balance: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Transfer, (transfer) => transfer.sender)
  outgoingTransfers: Relation<Transfer[]>;

  @OneToMany(() => Transfer, (transfer) => transfer.receiver)
  incomingTransfers: Relation<Transfer[]>;
}

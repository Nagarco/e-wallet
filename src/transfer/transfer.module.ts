import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service.js';
import { TransferController } from './transfer.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Transfer])],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}

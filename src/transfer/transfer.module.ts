import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service.js';
import { TransferController } from './transfer.controller.js';

@Module({
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}

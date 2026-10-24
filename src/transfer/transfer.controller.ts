import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { TransferService } from './transfer.service.js';
import { CreateTransferDto } from './dtos/create-transfer.dto.js';
import { PaginationDto } from './dtos/pagination.dto.js';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async transfer(@Body() dto: CreateTransferDto) {
    const transfer = await this.transferService.transfer(dto);

    return {
      message: 'Transfer completed successfully',
      transferId: transfer.id,
      status: transfer.status,
      amount: transfer.amount,
      createdAt: transfer.createdAt,
    };
  }

  @Get()
  async getAll(@Query() dto: PaginationDto) {
    return this.transferService.getAllTransfers(dto);
  }
}

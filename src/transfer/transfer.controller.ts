import { Controller } from '@nestjs/common';
import { TransferService } from './transfer.service.js';

@Controller('transfer')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}
}

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AccountService } from './account.service.js';
import { CreateAccountDto } from './dtos/create-account.dto.js';
import { AddBalanceDto } from './dtos/add-balance.dto.js';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  async create(@Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(dto);
  }

  @Put('add-balance')
  @HttpCode(HttpStatus.OK)
  async addBalance(@Body() dto: AddBalanceDto) {
    return this.accountService.addBalance(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    return this.accountService.deleteAccount(id);
  }
}

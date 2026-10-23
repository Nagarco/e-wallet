import { Controller } from '@nestjs/common';
import { AccountService } from './account.service.js';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}
}

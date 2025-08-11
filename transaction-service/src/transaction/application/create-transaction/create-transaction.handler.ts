import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';

import { Logger } from '@nestjs/common';
import { CreateTransactionUseCase } from './create-transaction.usecase';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  private readonly logger = new Logger(CreateTransactionHandler.name);
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
  ) {}

  async execute(command: CreateTransactionCommand) {
    const { createTransaction } = command;
    return await this.createTransactionUseCase.execute(createTransaction);
  }
}

import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UpdateTransactionCommand } from './update-transaction.command';
import { Logger } from '@nestjs/common';
import { UpdateTransactionUseCase } from './update-transaction.usecase';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler
  implements ICommandHandler<UpdateTransactionCommand>
{
  private readonly logger = new Logger(UpdateTransactionHandler.name);
  constructor(
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
  ) {}

  async execute(command: UpdateTransactionCommand) {
    const { updateTransaction } = command;
    return await this.updateTransactionUseCase.execute(updateTransaction);
  }
}

import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand } from './create-transaction.command';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { CreateTransactionUseCase } from './create-transaction.usecase';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler
  implements ICommandHandler<CreateTransactionCommand>
{
  private readonly logger = new Logger(CreateTransactionHandler.name);
  constructor(private readonly createUserUseCase: CreateTransactionUseCase) {}

  async execute(command: CreateTransactionCommand) {
    const { createTransaction } = command;
    return await this.createUserUseCase.execute(createTransaction);
  }
}

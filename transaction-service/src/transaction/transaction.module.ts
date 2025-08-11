import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateTransactionHandler } from 'src/transaction/application/create-transaction/create-transaction.handler';
import { GetTransactionHandler } from 'src/transaction/application/get-transaction/get-transaction.handler';
import { TransactionController } from './infrastructure/controllers/transaction.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { PrismaTransactionRepo } from './infrastructure/repositories/prisma-transaction.repo';
import { TRANSACTION_REPO } from './domain/transaction.repo';
import { CreateTransactionUseCase } from './application/create-transaction/create-transaction.usecase';
import { GetTransactionUseCase } from './application/get-transaction/get-transaction.usecase';
import { EventBusModule } from 'src/event-bus/event-bus.module';
import { UpdateTransactionHandler } from 'src/transaction/application/update-transaction/update-transaction.handler';
import { UpdateTransactionUseCase } from './application/update-transaction/update-transaction.usecase';

export const QueryHandlers = [GetTransactionHandler];

export const CommandHandlers = [
  CreateTransactionHandler,
  UpdateTransactionHandler,
];

export const UseCases = [
  UpdateTransactionUseCase,
  CreateTransactionUseCase,
  GetTransactionUseCase,
];

@Module({
  imports: [PrismaModule, CqrsModule, ConfigModule, EventBusModule],
  controllers: [TransactionController],
  providers: [
    ...CommandHandlers,
    ...UseCases,
    ...QueryHandlers,
    {
      useClass: PrismaTransactionRepo,
      provide: TRANSACTION_REPO,
    },
  ],
})
export class TransactionModule {}

import { Controller, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod } from '@nestjs/microservices';

import { CreateTransactionCommand } from 'src/transaction/application/create-transaction/create-transaction.command';

import { GetTransactionQuery } from 'src/transaction/application/get-transaction/get-transaction.query';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @GrpcMethod('TransactionService', 'CreateTransaction')
  async createTransaction(data: any): Promise<any> {
    const result = await this.commandBus.execute(
      new CreateTransactionCommand(data),
    );
    return { createTransactionResponse: result };
  }

  @GrpcMethod('TransactionService', 'GetTransaction')
  async GetTransaction(data: any): Promise<any> {
    const result = await this.queryBus.execute(new GetTransactionQuery(data));
    if (!result) {
      return {
        error: {
          message: 'TRANSACTION NOT FOUND',
        },
      };
    }
    return { getTransactionRequest: result };
  }
}

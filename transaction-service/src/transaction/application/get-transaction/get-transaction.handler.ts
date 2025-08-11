import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery } from './get-transaction.query';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from '@nestjs/common';
import { GetTransactionUseCase } from './get-transaction.usecase';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler
  implements IQueryHandler<GetTransactionQuery>
{
  private readonly logger = new Logger(GetTransactionHandler.name);
  constructor(private readonly getTransactionUseCase: GetTransactionUseCase) {}

  async execute(query: GetTransactionQuery) {
    const { transactionId } = query;

    return await this.getTransactionUseCase.execute(transactionId);
  }
}

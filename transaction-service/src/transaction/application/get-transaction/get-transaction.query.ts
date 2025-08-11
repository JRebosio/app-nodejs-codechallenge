import { IQuery } from '@nestjs/cqrs';
import { TransactionId } from 'src/transaction/domain/transaction.repo';

export class GetTransactionQuery implements IQuery {
  constructor(public readonly transactionId: TransactionId) {}
}

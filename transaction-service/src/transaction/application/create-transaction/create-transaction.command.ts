import { ICommand } from '@nestjs/cqrs';
import { Transaction } from 'src/transaction/domain/transaction.repo';

export class CreateTransactionCommand implements ICommand {
  constructor(public readonly createTransaction: Transaction) {}
}

import { ICommand } from '@nestjs/cqrs';
import { UpdateTransaction } from 'src/transaction/domain/transaction.repo';

export class UpdateTransactionCommand implements ICommand {
  constructor(public readonly updateTransaction: UpdateTransaction) {}
}

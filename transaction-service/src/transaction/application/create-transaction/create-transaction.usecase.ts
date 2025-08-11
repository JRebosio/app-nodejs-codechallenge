import { Inject, Logger } from '@nestjs/common';

import {
  ITransactionRepo,
  TRANSACTION_REPO,
  Transaction,
} from 'src/transaction/domain/transaction.repo';

export class CreateTransactionUseCase {
  private readonly logger = new Logger(CreateTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPO)
    private readonly transactionRepo: ITransactionRepo,
  ) {}

  async execute(transaction: Transaction): Promise<Transaction> {
    try {
      await this.transactionRepo.create(transaction);
      return transaction;
    } catch (err) {
      this.logger.error('CREATE TRANSACTION ERROR');
      throw err;
    }
  }
}

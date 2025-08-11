import { Inject, Logger } from '@nestjs/common';

import {
  ITransactionRepo,
  TRANSACTION_REPO,
  UpdateTransaction,
} from 'src/transaction/domain/transaction.repo';

export class UpdateTransactionUseCase {
  private readonly logger = new Logger(UpdateTransactionUseCase.name);

  constructor(
    @Inject(TRANSACTION_REPO)
    private readonly transactionRepo: ITransactionRepo,
  ) {}

  async execute(updateTransaction: UpdateTransaction): Promise<void> {
    try {
      await this.transactionRepo.updateStatus(updateTransaction);
    } catch (err) {
      this.logger.error('UPDATE TRANSACTION ERROR');
      throw err;
    }
  }
}

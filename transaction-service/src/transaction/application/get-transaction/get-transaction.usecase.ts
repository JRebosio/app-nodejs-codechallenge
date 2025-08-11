import { Inject, Logger } from '@nestjs/common';
import {
  ITransactionRepo,
  TRANSACTION_REPO,
  TransactionId,
} from 'src/transaction/domain/transaction.repo';

const TRANSACTION_TYPE_MAP: Record<number, string> = {
  1: 'DEPOSIT',
  2: 'TRANSFER',
  3: 'SERVICE',
};

export class GetTransactionUseCase {
  private readonly logger = new Logger(GetTransactionUseCase.name);
  constructor(
    @Inject(TRANSACTION_REPO)
    private readonly transactionRepo: ITransactionRepo,
  ) {}

  async execute(transactionId: TransactionId): Promise<any> {
    try {
      const transaction =
        await this.transactionRepo.getByTransactionId(transactionId);

      if (!transaction) {
        return null;
      }

      const response = {
        transactionExternalId: transaction.id,
        transactionType: {
          name:
            TRANSACTION_TYPE_MAP[transaction.transactionTypeId] || 'Unknown',
        },
        transactionStatus: {
          name: transaction.status,
        },
        value: transaction.value.toString(),
      };

      return response;
    } catch (err) {
      this.logger.error('GET TRANSACTION ERROR');
      throw err;
    }
  }
}

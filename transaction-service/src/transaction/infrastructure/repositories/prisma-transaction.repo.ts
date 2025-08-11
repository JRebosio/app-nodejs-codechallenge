import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ITransactionRepo,
  Transaction,
  TransactionId,
  UpdateTransaction,
} from '../../domain/transaction.repo';

@Injectable()
export class PrismaTransactionRepo implements ITransactionRepo {
  private readonly logger = new Logger(PrismaTransactionRepo.name);
  constructor(private readonly prismaService: PrismaService) {}

  async create(transaction: Transaction): Promise<Transaction> {
    try {
      const new_transaction = await this.prismaService.transaction.create({
        data: {
          accountExternalIdDebit: transaction.accountExternalIdDebit,
          accountExternalIdCredit: transaction.accountExternalIdCredit,
          transactionTypeId: transaction.transactionTypeId,
          value: transaction.value,
        },
      });
      return new_transaction;
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  async getByTransactionId(
    transactionId: TransactionId,
  ): Promise<Transaction | null> {
    const transaction = await this.prismaService.transaction.findFirst({
      where: { id: transactionId.transactionExternalId },
    });

    if (!transaction) {
      return null;
    }

    return transaction;
  }

  async updateStatus(
    updateTransaction: UpdateTransaction,
  ): Promise<Transaction | null> {
    const transaction = await this.prismaService.transaction.update({
      where: { id: updateTransaction.transactionId },
      data: { status: updateTransaction.transactionStatus },
    });

    if (!transaction) {
      return null;
    }

    return transaction;
  }
}

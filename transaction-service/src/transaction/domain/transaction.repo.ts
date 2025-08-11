import { Decimal } from 'generated/prisma/runtime/library';

export interface Transaction {
  id?: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transactionTypeId: number;
  status?: string;
  value: Decimal;
  createdAt?: Date;
  updateAt?: Date;
  // add optional
}
export interface TransactionId {
  transactionExternalId: string;
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface UpdateTransaction {
  transactionStatus?: TransactionStatus;
  transactionId?: string;
}

export const TRANSACTION_REPO = 'TRANSACTION REPOSITORY';

export interface ITransactionRepo {
  create(transaction: Transaction): Promise<Transaction>;
  getByTransactionId(transactionId: TransactionId): Promise<Transaction | null>;
  updateStatus(
    updateTransaction: UpdateTransaction,
  ): Promise<Transaction | null>;
}

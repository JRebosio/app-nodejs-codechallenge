import { Decimal } from "generated/prisma/runtime/library";

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

export const TRANSACTION_REPO = 'TRANSACTION REPOSITORY';

export interface ITransactionRepo {
  create(transaction: Transaction): Promise<Transaction>;
  getByTransactionId(transactionId: TransactionId): Promise<Transaction | null>;
}

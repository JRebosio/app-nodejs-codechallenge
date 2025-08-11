import { Controller, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GrpcMethod, EventPattern, Payload } from '@nestjs/microservices';
import { KafkaEventBus } from 'src/event-bus/kafka.event-bus';
import { CreateTransactionCommand } from 'src/transaction/application/create-transaction/create-transaction.command';
import { UpdateTransactionCommand } from 'src/transaction/application/update-transaction/update-transaction.command';
import { GetTransactionQuery } from 'src/transaction/application/get-transaction/get-transaction.query';
import {
  TOPIC_TRANSACTIONS_ACCEPTED,
  TOPIC_TRANSACTIONS_REJECTED,
  TOPIC_TRANSACTIONS_PENDING,
} from 'src/event-bus/event-bus.constants';
import { TransactionStatus } from 'src/transaction/domain/transaction.repo';
@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: KafkaEventBus,
  ) {}

  @GrpcMethod('TransactionService', 'CreateTransaction')
  async createTransaction(data: any): Promise<any> {
    const result = await this.commandBus.execute(
      new CreateTransactionCommand(data),
    );

    await this.sendPendingTransaction(result);

    return { createTransactionResponse: result };
  }

  @GrpcMethod('TransactionService', 'GetTransaction')
  async GetTransaction(data: any): Promise<any> {
    const result = await this.queryBus.execute(new GetTransactionQuery(data));
    if (!result) {
      return {
        error: {
          message: 'TRANSACTION NOT FOUND',
        },
      };
    }
    return { getTransactionRequest: result };
  }

  @EventPattern(TOPIC_TRANSACTIONS_ACCEPTED)
  async UpdateAcceptedTransactions(@Payload() eventMessage) {
    try {
      this.logger.log(
        `[TRANSACTION_UUID]: ${eventMessage.id} [EVENT]: rejected-transaction`,
      );
      await this.commandBus.execute(
        new UpdateTransactionCommand({
          transactionId: eventMessage.id,
          transactionStatus: TransactionStatus.APPROVED,
        }),
      );
    } catch (e) {
      this.logger.error(
        `Error processing accepted transaction: ${e.message}`,
        e.stack,
      );
    }
  }

  @EventPattern(TOPIC_TRANSACTIONS_REJECTED)
  async UpdateRejectedTransactions(@Payload() eventMessage) {
    try {
      this.logger.log(
        `[TRANSACTION_UUID]: ${eventMessage.id} [EVENT]: rejected-transaction`,
      );
      await this.commandBus.execute(
        new UpdateTransactionCommand({
          transactionId: eventMessage.id,
          transactionStatus: TransactionStatus.REJECTED,
        }),
      );
    } catch (e) {
      this.logger.error(
        `Error processing rejected transaction: ${e.message}`,
        e.stack,
      );
    }
  }

  async sendPendingTransaction(eventMessage: any): Promise<void> {
    await this.eventBus.sendEvent(TOPIC_TRANSACTIONS_PENDING, {
      id: eventMessage.id,
      value: eventMessage.value,
    });
  }
}

import { KafkaOptions, Transport } from '@nestjs/microservices';

export const kafkaConfig: KafkaOptions = {
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: 'client',
      brokers: ['localhost:9092'],
      retry: {
        initialRetryTime: 30,
        retries: 2,
      },
    },
    consumer: {
      groupId: 'transaction-consumer-group',
      allowAutoTopicCreation: true,
    },
  },
};

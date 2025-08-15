# High-Transaction Microservice Architecture

## Challenge Overview
Built a microservice system to handle high-volume financial transactions with fraud detection capabilities.

## Architecture
Two specialized services with Redis caching layer:
- **Transaction Service**: Manages transaction lifecycle via gRPC with Redis caching
- **Anti-Fraud Service**: Asynchronous fraud validation using Kafka events

## Technology Choices

### gRPC over REST/GraphQL
- **60% smaller payloads** with Protocol Buffers vs JSON
- **HTTP/2 performance** with binary serialization
- **Type safety** and automatic code generation
- **Streaming support** for real-time updates

### Hexagonal Architecture
- **Business logic isolation** from infrastructure dependencies
- **Easy testing** of core domain without external systems
- **Flexible integrations** through adapter pattern
- **Technology swapping** without affecting business rules

## Tech Stack
- **Framework**: NestJS + TypeScript
- **Communication**: gRPC
- **Messaging**: Apache Kafka
- **Database**: PostgreSQL + Prisma ORM
- **Caching**: Redis for high-performance data access
- **Pattern**: CQRS for read/write separation

## Quick Start
### Run docker 
```bash
docker-compose up -d
```

### Create env file:
-   Transaction service
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres?schema=public
REDIS_HOST = 127.0.0.1:6379
```


### Run each service:
```bash
# Install
npm install

# Run prisma migration (only Transaction Service)
npx prisma migrate dev --name init
npx prisma generate

# Build and run services
 npm run build && npm run start:prod
```

## Endpoints
- **Transaction Service**: `grpc://localhost:9000/` + health at `:3000`
- **Anti-Fraud Service**: Health at `:3005` + internal Kafka communication

## Scaling Strategy
- **Horizontal scaling**: Multiple service instances
- **Kafka partitioning**: Parallel message processing
- **gRPC load balancing**: Efficient request distribution
- **Redis caching**: Sub-millisecond response times for frequent queries

## Future Enhancements
- Advanced Redis clustering for higher availability
- Comprehensive testing suite
- Monitoring and alerting
- Database sharding for extreme volumes
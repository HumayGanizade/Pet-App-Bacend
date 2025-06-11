import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.enableCors({
    origin: 'http://localhost:4200', // Allow frontend
    allowedHeaders: ['Authorization', 'Content-Type'], // Ensure headers are accepted
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // Allow necessary methods
    credentials: true, // Allow cookies or auth headers
  });

  await app.listen(41433);
}
bootstrap();

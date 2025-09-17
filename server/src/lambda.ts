import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import type { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';

let cachedServer: Handler;

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<unknown> => {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await nestApp.init();
    // The serverlessExpress library does not have strong typing for its return value.
    // We are disabling this rule for this line as we know the assignment is safe.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    cachedServer = serverlessExpress({
      app: nestApp.getHttpAdapter().getInstance(),
    });
  }

  return cachedServer(event, context, () => null);
};

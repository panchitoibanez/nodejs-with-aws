import { configure as serverlessExpress } from '@codegenie/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import type { APIGatewayProxyEvent, Context } from 'aws-lambda';

let cachedServer: ReturnType<typeof serverlessExpress>;

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<unknown> => {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    nestApp.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await nestApp.init();
    cachedServer = serverlessExpress({
      app: expressApp,
    });
  }

  return cachedServer(event, context, () => {});
};

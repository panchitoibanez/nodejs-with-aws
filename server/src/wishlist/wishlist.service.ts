import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
  GetCommand, // <-- Import GetCommand
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

@Injectable()
export class WishlistService {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;
  private readonly sqsClient: SQSClient;

  constructor(private readonly configService: ConfigService) {
    const client = new DynamoDBClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.docClient = DynamoDBDocumentClient.from(client);
    this.sqsClient = new SQSClient({ // <-- Initialize SQS client
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.tableName = 'SmartWishlistTable'; // In a real app, this would also be in config
  }

  async createWishlist(
    userId: string,
    name: string,
  ): Promise<{ wishlistId: string; name: string }> {
    const wishlistId = randomUUID();
    const item = {
      PK: `USER#${userId}`,
      SK: `WISHLIST#${wishlistId}`,
      Name: name,
      CreatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: this.tableName,
      Item: item,
    });

    await this.docClient.send(command);

    return { wishlistId, name };
  }

  async getWishlistsForUser(userId: string) {
    const command = new QueryCommand({  
      TableName: this.tableName,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
      },
    });

    const { Items } = await this.docClient.send(command);
    return Items;
  }

  async deleteWishlist(userId: string, wishlistId: string): Promise<void> {
    const command = new DeleteCommand({ 
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `WISHLIST#${wishlistId}`,
      },
      // This is an important addition for security
      ConditionExpression: 'attribute_exists(PK)',
    });

    try {
      await this.docClient.send(command);
    } catch (error) {
      // This error occurs if the ConditionExpression fails
      if (error.name === 'ConditionalCheckFailedException') {
        throw new NotFoundException(
          `Wishlist with ID ${wishlistId} not found or you do not have permission to delete it.`,
        );
      }
      throw error;
    }
  }

  async updateWishlist(userId: string, wishlistId: string, name: string) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `WISHLIST#${wishlistId}`,
      },
      UpdateExpression: 'set #N = :n',
      ExpressionAttributeNames: {
        '#N': 'Name',
      },
      ExpressionAttributeValues: {
        ':n': name,
      },
      ConditionExpression: 'attribute_exists(PK)',
      ReturnValues: 'ALL_NEW',
    });

    try {
      const { Attributes } = await this.docClient.send(command);
      return Attributes;
    } catch (error) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new NotFoundException(
          `Wishlist with ID ${wishlistId} not found or you do not have permission to update it.`,
        );
      }
      throw error;
    }
  }

  async addItemToWishlist(
    userId: string,
    wishlistId: string,
    url: string,
  ): Promise<{ itemId: string }> {
    // 1. First, verify the wishlist exists and belongs to the user
    const getCommand = new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: `USER#${userId}`,
        SK: `WISHLIST#${wishlistId}`,
      },
    });

    const { Item: wishlist } = await this.docClient.send(getCommand);
    if (!wishlist) {
      throw new NotFoundException(`Wishlist with ID ${wishlistId} not found.`);
    }

    const itemId = randomUUID();

    // 2. Create the item in DynamoDB with a PENDING status
    const item = {
      PK: `USER#${userId}`,
      SK: `WISHLIST#${wishlistId}#ITEM#${itemId}`,
      Url: url,
      Status: 'PENDING',
      CreatedAt: new Date().toISOString(),
    };

    const putCommand = new PutCommand({
      TableName: this.tableName,
      Item: item,
      // We no longer need the incorrect ConditionExpression here
    });

    // 3. Create the message to send to SQS
    const message = {
      userId,
      wishlistId,
      itemId,
      url,
    };

    const sendMessageCommand = new SendMessageCommand({
      QueueUrl: this.configService.get<string>('SQS_QUEUE_URL'),
      MessageBody: JSON.stringify(message),
    });

    try {
      // We can run these in parallel for better performance
      await Promise.all([
        this.docClient.send(putCommand),
        this.sqsClient.send(sendMessageCommand),
      ]);
    } catch (error) {
      // The old error handling is no longer needed here as we checked above
      console.error('Error adding item to wishlist:', error);
      throw error;
    }

    return { itemId };
  }
}
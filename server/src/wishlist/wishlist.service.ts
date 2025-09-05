import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,    
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

@Injectable()
export class WishlistService {
  private readonly docClient: DynamoDBDocumentClient;
  private readonly tableName: string;

  constructor(private readonly configService: ConfigService) {
    const client = new DynamoDBClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.docClient = DynamoDBDocumentClient.from(client);
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
}
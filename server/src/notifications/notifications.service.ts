import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

export interface NotificationMessage {
  type:
    | 'ITEM_ADDED'
    | 'ITEM_UPDATED'
    | 'ITEM_DELETED'
    | 'WISHLIST_CREATED'
    | 'WISHLIST_UPDATED'
    | 'WISHLIST_DELETED'
    | 'SCRAPING_COMPLETED'
    | 'SCRAPING_FAILED';
  userId: string;
  wishlistId?: string;
  itemId?: string;
  data?: Record<string, any>;
}

export interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  htmlMessage?: string;
}

@Injectable()
export class NotificationsService {
  private readonly snsClient: SNSClient;
  private readonly topicArn: string;

  constructor(private readonly configService: ConfigService) {
    this.snsClient = new SNSClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
    this.topicArn = this.configService.get<string>('SNS_TOPIC_ARN') || '';
  }

  /**
   * Send a notification about wishlist activity
   */
  async sendWishlistNotification(notification: NotificationMessage): Promise<void> {
    const message = this.formatNotificationMessage(notification);

    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Message: message,
      Subject: this.getNotificationSubject(notification.type),
      MessageAttributes: {
        type: {
          DataType: 'String',
          StringValue: notification.type,
        },
        userId: {
          DataType: 'String',
          StringValue: notification.userId,
        },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });

    try {
      await this.snsClient.send(command);
      console.log(`Notification sent for ${notification.type} to user ${notification.userId}`);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send an email notification
   */
  async sendEmailNotification(emailNotification: EmailNotification): Promise<void> {
    const message = JSON.stringify({
      default: emailNotification.message,
      email: {
        subject: emailNotification.subject,
        message: emailNotification.htmlMessage || emailNotification.message,
        to: emailNotification.to,
      },
    });

    const command = new PublishCommand({
      TopicArn: this.topicArn,
      Message: message,
      Subject: emailNotification.subject,
      MessageAttributes: {
        notificationType: {
          DataType: 'String',
          StringValue: 'EMAIL',
        },
        recipient: {
          DataType: 'String',
          StringValue: emailNotification.to,
        },
        timestamp: {
          DataType: 'String',
          StringValue: new Date().toISOString(),
        },
      },
    });

    try {
      await this.snsClient.send(command);
      console.log(`Email notification sent to ${emailNotification.to}`);
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  /**
   * Send notification when item is added to wishlist
   */
  async notifyItemAdded(
    userId: string,
    wishlistId: string,
    itemId: string,
    url: string,
  ): Promise<void> {
    await this.sendWishlistNotification({
      type: 'ITEM_ADDED',
      userId,
      wishlistId,
      itemId,
      data: { url },
    });
  }

  /**
   * Send notification when item is updated
   */
  async notifyItemUpdated(
    userId: string,
    wishlistId: string,
    itemId: string,
    changes: Record<string, any>,
  ): Promise<void> {
    await this.sendWishlistNotification({
      type: 'ITEM_UPDATED',
      userId,
      wishlistId,
      itemId,
      data: changes,
    });
  }

  /**
   * Send notification when item is deleted
   */
  async notifyItemDeleted(userId: string, wishlistId: string, itemId: string): Promise<void> {
    await this.sendWishlistNotification({
      type: 'ITEM_DELETED',
      userId,
      wishlistId,
      itemId,
    });
  }

  /**
   * Send notification when wishlist is created
   */
  async notifyWishlistCreated(
    userId: string,
    wishlistId: string,
    wishlistName: string,
  ): Promise<void> {
    await this.sendWishlistNotification({
      type: 'WISHLIST_CREATED',
      userId,
      wishlistId,
      data: { name: wishlistName },
    });
  }

  /**
   * Send notification when wishlist is updated
   */
  async notifyWishlistUpdated(
    userId: string,
    wishlistId: string,
    changes: Record<string, any>,
  ): Promise<void> {
    await this.sendWishlistNotification({
      type: 'WISHLIST_UPDATED',
      userId,
      wishlistId,
      data: changes,
    });
  }

  /**
   * Send notification when wishlist is deleted
   */
  async notifyWishlistDeleted(
    userId: string,
    wishlistId: string,
    wishlistName: string,
  ): Promise<void> {
    await this.sendWishlistNotification({
      type: 'WISHLIST_DELETED',
      userId,
      wishlistId,
      data: { name: wishlistName },
    });
  }

  /**
   * Send notification when scraping is completed
   */
  async notifyScrapingCompleted(
    userId: string,
    wishlistId: string,
    itemId: string,
    productData: Record<string, any>,
  ): Promise<void> {
    await this.sendWishlistNotification({
      type: 'SCRAPING_COMPLETED',
      userId,
      wishlistId,
      itemId,
      data: productData,
    });
  }

  /**
   * Send notification when scraping fails
   */
  async notifyScrapingFailed(
    userId: string,
    wishlistId: string,
    itemId: string,
    error: string,
  ): Promise<void> {
    await this.sendWishlistNotification({
      type: 'SCRAPING_FAILED',
      userId,
      wishlistId,
      itemId,
      data: { error },
    });
  }

  private formatNotificationMessage(notification: NotificationMessage): string {
    const baseMessage = {
      type: notification.type,
      userId: notification.userId,
      timestamp: new Date().toISOString(),
      wishlistId: notification.wishlistId,
      itemId: notification.itemId,
      data: notification.data,
    };

    return JSON.stringify(baseMessage);
  }

  private getNotificationSubject(type: string): string {
    const subjects: Record<string, string> = {
      ITEM_ADDED: 'New Item Added to Wishlist',
      ITEM_UPDATED: 'Wishlist Item Updated',
      ITEM_DELETED: 'Item Removed from Wishlist',
      WISHLIST_CREATED: 'New Wishlist Created',
      WISHLIST_UPDATED: 'Wishlist Updated',
      WISHLIST_DELETED: 'Wishlist Deleted',
      SCRAPING_COMPLETED: 'Product Information Updated',
      SCRAPING_FAILED: 'Product Scraping Failed',
    };

    return subjects[type] || 'Smart Wishlist Notification';
  }
}

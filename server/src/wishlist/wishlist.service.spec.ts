import { Test, TestingModule } from '@nestjs/testing';
import { WishlistService } from './wishlist.service';
import { ConfigService } from '@nestjs/config';
import { NotificationsService } from '../notifications/notifications.service';

describe('WishlistService', () => {
  let service: WishlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'AWS_REGION') return 'us-east-1';
              if (key === 'SQS_QUEUE_URL')
                return 'https://sqs.us-east-1.amazonaws.com/123456789012/test-queue';
              // Add other necessary config mocks here if needed
              return null;
            }),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            notifyWishlistCreated: jest.fn(),
            notifyItemAdded: jest.fn(),
            notifyItemUpdated: jest.fn(),
            notifyItemDeleted: jest.fn(),
            notifyWishlistUpdated: jest.fn(),
            notifyWishlistDeleted: jest.fn(),
            notifyScrapingCompleted: jest.fn(),
            notifyScrapingFailed: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

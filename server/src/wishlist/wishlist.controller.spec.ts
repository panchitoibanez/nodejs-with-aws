import { Test, TestingModule } from '@nestjs/testing';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '../auth/auth/auth.guard';

describe('WishlistController', () => {
  let controller: WishlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistController],
      providers: [
        {
          provide: WishlistService,
          useValue: {
            // Mock the methods that are called by the controller
            createWishlist: jest.fn(),
            getWishlistsForUser: jest.fn(),
            deleteWishlist: jest.fn(),
            updateWishlist: jest.fn(),
            addItemToWishlist: jest.fn(),
          },
        },
        // We need to provide the AuthGuard and its dependency here
        AuthGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'AWS_REGION') return 'us-east-1';
              if (key === 'COGNITO_USER_POOL_ID') return 'us-east-1_testPool';
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<WishlistController>(WishlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

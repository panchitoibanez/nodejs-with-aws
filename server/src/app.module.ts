import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WishlistModule } from './wishlist/wishlist.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, WishlistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

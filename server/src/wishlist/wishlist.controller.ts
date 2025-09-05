import {
    Controller,
    Post,
    Body,
    Request,
    UseGuards,
    HttpCode,
    HttpStatus,
    Get,
    Delete,
    Param,
    ParseUUIDPipe,
    Patch,
  } from '@nestjs/common';
  import { WishlistService } from './wishlist.service';
  import { CreateWishlistDto } from './dto/create-wishlist.dto';
  import { AuthGuard } from '../auth/auth/auth.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
  
  @Controller('wishlist')
  @UseGuards(AuthGuard) // Apply the guard to the entire controller
  export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Request() req, @Body() createWishlistDto: CreateWishlistDto) {
      // The user's ID (`sub`) is available on `req.user` thanks to our AuthGuard
      const userId = req.user.sub;
      return this.wishlistService.createWishlist(userId, createWishlistDto.name);
    }

    @Get()
    findAll(@Request() req) {
        const userId = req.user.sub;
        return this.wishlistService.getWishlistsForUser(userId);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Request() req, @Param('id', ParseUUIDPipe) id: string) {
        const userId = req.user.sub;
        return this.wishlistService.deleteWishlist(userId, id);
    }

    @Patch(':id')
    update(
      @Request() req,
      @Param('id', ParseUUIDPipe) id: string,
      @Body() updateWishlistDto: UpdateWishlistDto,
    ) {
      const userId = req.user.sub;
      return this.wishlistService.updateWishlist(
        userId,
        id,
        updateWishlistDto.name,
      );
    }
    
  }
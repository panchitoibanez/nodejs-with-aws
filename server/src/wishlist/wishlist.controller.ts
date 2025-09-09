import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  ParseUUIDPipe,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { AuthGuard } from '../auth/auth/auth.guard';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AddItemDto } from './dto/add-item.dto';
import type { Request as ExpressRequest } from 'express';

@Controller('wishlist')
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  private getUserId(req: ExpressRequest): string {
    // Our AuthGuard ensures user and sub exist if the guard passes.
    // This check satisfies TypeScript's strict null checks.
    if (!req.user?.sub) {
      throw new UnauthorizedException('User ID not found on request');
    }
    return req.user.sub;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req: ExpressRequest, @Body() createWishlistDto: CreateWishlistDto) {
    const userId = this.getUserId(req);
    return this.wishlistService.createWishlist(userId, createWishlistDto.name);
  }

  @Get()
  findAll(@Request() req: ExpressRequest) {
    const userId = this.getUserId(req);
    return this.wishlistService.getWishlistsForUser(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Request() req: ExpressRequest, @Param('id', ParseUUIDPipe) id: string) {
    const userId = this.getUserId(req);
    return this.wishlistService.deleteWishlist(userId, id);
  }

  @Patch(':id')
  update(
    @Request() req: ExpressRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    const userId = this.getUserId(req);
    return this.wishlistService.updateWishlist(userId, id, updateWishlistDto.name);
  }

  @Post(':id/item')
  @HttpCode(HttpStatus.ACCEPTED)
  addItem(
    @Request() req: ExpressRequest,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addItemDto: AddItemDto,
  ) {
    const userId = this.getUserId(req);
    return this.wishlistService.addItemToWishlist(userId, id, addItemDto.url);
  }
}

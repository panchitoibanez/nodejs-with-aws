import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { InitiateAuthCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import { AuthGuard } from './auth/auth.guard';
import type { Request as ExpressRequest } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.NO_CONTENT)
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    const { email, name, password } = signUpDto;
    return this.authService.signUp(email, name, password);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<InitiateAuthCommandOutput['AuthenticationResult']> {
    const { email, password } = signInDto;
    return this.authService.signIn(email, password);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req: ExpressRequest) {
    // The AuthGuard guarantees req.user exists, so we can assert it.
    if (!req.user) {
      throw new UnauthorizedException('User payload not found on request.');
    }
    return req.user;
  }
}

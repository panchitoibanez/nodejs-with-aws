import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, verify } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

// We are extending the Express Request object to include our custom user property
declare module 'express' {
  interface Request {
    user: JwtPayload & {
      'cognito:username': string;
      email: string;
    };
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  private jwks: any;

  constructor(private readonly configService: ConfigService) {
    this.fetchJwks();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.verifyToken(token);
      (request as any).user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Token is not valid');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Express request headers are indexed by string, so use bracket notation
    const authHeader = (request.headers as any)['authorization'] as string | undefined;
    if (!authHeader) return undefined;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }

  private async fetchJwks() {
    const region = this.configService.get<string>('AWS_REGION');
    const userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');

    const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

    try {
      const response = await fetch(jwksUrl);
      const data = await response.json();
      this.jwks = data.keys;
    } catch (error) {
      console.error('Error fetching JWKS:', error);
      // Handle the error appropriately, maybe retry or throw a startup error
    }
  }

  private async verifyToken(token: string): Promise<any> {
    // 1. Decode the token to get the 'kid' (Key ID) from the header
    const decodedToken = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    const kid = decodedToken.kid;

    // 2. Find the matching key in our fetched JWKS
    const jwk = this.jwks.find((key) => key.kid === kid);
    if (!jwk) {
      throw new Error('No matching JWK found');
    }

    // 3. Convert the JWK to a PEM format
    const pem = jwkToPem(jwk);

    // 4. Verify the token's signature using the PEM key
    return new Promise((resolve, reject) => {
      verify(token, pem, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, verify } from 'jsonwebtoken';
// ⬇️ IMPORTANT: do NOT import { JWK } – it's too loose and trips eslint
import jwkToPemLib from 'jwk-to-pem';
import type { Request } from 'express';

// --- Strong JWK typing for Cognito ---
interface CognitoJwk {
  kid: string;
  kty: 'RSA';
  n: string;
  e: string;
  alg?: string;
  use?: string;
}

// A strictly-typed wrapper around jwk-to-pem to avoid "unsafe call" lint
const jwkToPemStrict: (jwk: CognitoJwk) => string = jwkToPemLib as unknown as (
  jwk: CognitoJwk,
) => string;

// --- Helper Type Guards & Interfaces ---
function isJwk(key: unknown): key is CognitoJwk {
  return (
    typeof key === 'object' &&
    key !== null &&
    'kid' in key &&
    'kty' in key &&
    'n' in key &&
    'e' in key &&
    typeof (key as { kid: unknown }).kid === 'string' &&
    (key as { kty: unknown }).kty === 'RSA' &&
    typeof (key as { n: unknown }).n === 'string' &&
    typeof (key as { e: unknown }).e === 'string'
  );
}

function isDecodedTokenHeader(header: unknown): header is { kid: string } {
  return (
    typeof header === 'object' &&
    header !== null &&
    'kid' in header &&
    typeof (header as { kid: unknown }).kid === 'string'
  );
}

export interface UserPayload extends JwtPayload {
  'cognito:username': string;
  email: string;
  sub: string;
}

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);
  private pems: Record<string, string> = {};

  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (Object.keys(this.pems).length === 0) {
      await this.fetchJwks();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.verifyToken(token);
      request.user = decoded;
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Token verification failed: ${errorMessage}`);
      throw new UnauthorizedException('Token is not valid');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async fetchJwks() {
    const region = this.configService.get<string>('AWS_REGION');
    const userPoolId = this.configService.get<string>('COGNITO_USER_POOL_ID');
    const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

    try {
      const response = await fetch(jwksUrl);
      const jsonData: unknown = await response.json();

      if (
        typeof jsonData === 'object' &&
        jsonData !== null &&
        'keys' in jsonData &&
        Array.isArray((jsonData as { keys?: unknown }).keys)
      ) {
        const keys = (jsonData as { keys: unknown[] }).keys;

        // ✅ All typing is explicit; no "unsafe call/assignment" here
        this.pems = keys.reduce<Record<string, string>>((acc, key) => {
          if (isJwk(key)) {
            acc[key.kid] = jwkToPemStrict(key);
          }
          return acc;
        }, {});
      }

      this.logger.log('Successfully fetched and cached JWKS as PEMs.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error fetching JWKS: ${errorMessage}`);
      throw new Error('Failed to fetch JWKS');
    }
  }

  private async verifyToken(token: string): Promise<UserPayload> {
    const [headerB64] = token.split('.');
    if (!headerB64) {
      throw new Error('Token header segment missing');
    }

    const headerJson = Buffer.from(headerB64, 'base64').toString('utf8');

    let decodedTokenHeader: unknown;
    try {
      decodedTokenHeader = JSON.parse(headerJson);
    } catch {
      throw new Error('Invalid token header encoding');
    }

    if (!isDecodedTokenHeader(decodedTokenHeader)) {
      throw new Error('Token header is invalid or missing kid');
    }

    const pem = this.pems[decodedTokenHeader.kid];
    if (!pem) {
      throw new Error('No matching PEM found for token');
    }

    return new Promise((resolve, reject) => {
      verify(token, pem, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) return reject(err);
        if (!decoded) return reject(new Error('Token could not be decoded.'));
        resolve(decoded as UserPayload);
      });
    });
  }
}

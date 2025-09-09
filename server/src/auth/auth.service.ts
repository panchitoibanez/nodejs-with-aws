import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
export class AuthService {
  private readonly cognitoClient: CognitoIdentityProviderClient;

  constructor(private readonly configService: ConfigService) {
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: this.configService.get<string>('AWS_REGION'),
    });
  }

  async signUp(email: string, name: string, password: string): Promise<void> {
    const clientId = this.configService.get<string>('COGNITO_CLIENT_ID');

    const command = new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
      ],
    });

    try {
      await this.cognitoClient.send(command);
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<InitiateAuthCommandOutput['AuthenticationResult']> {
    const clientId = this.configService.get<string>('COGNITO_CLIENT_ID');

    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const { AuthenticationResult } = await this.cognitoClient.send(command);
      return AuthenticationResult;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }
}

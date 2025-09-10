import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define a parameter for the Docker image tag ---
    const imageTag = new cdk.CfnParameter(this, 'imageTag', {
      type: 'String',
      description: 'The tag of the Docker image to deploy.',
    });

    // 1. DynamoDB Table (already defined)
    const table = new dynamodb.Table(this, 'SmartWishlistTable', {
      tableName: 'SmartWishlistTable',
      partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // 2. Cognito User Pool
    const userPool = new cognito.UserPool(this, 'SmartWishlistUserPool', {
      userPoolName: 'smart-wishlist-pool',
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'SmartWishlistUserPoolClient', {
      userPool,
      userPoolClientName: 'smart-wishlist-app-client',
      authFlows: {
        userPassword: true,
      },
      generateSecret: false,
    });

    // 3. SQS Queue
    const queue = new sqs.Queue(this, 'SmartWishlistQueue', {
      queueName: 'SmartWishlistQueue',
    });

    // 4. IAM Role for the Lambda Function
    const scraperRole = new iam.Role(this, 'SmartWishlistScraperRole', {
      roleName: 'SmartWishlistScraperRole',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    // 5. Lambda Function
    const scraperLambda = new lambda.Function(this, 'SmartWishlistScraper', {
      functionName: 'SmartWishlistScraper',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../scraper-lambda')),
      role: scraperRole,
      timeout: cdk.Duration.seconds(10),
    });

    // 6. Grant Permissions
    table.grantWriteData(scraperRole); // Grant write access to DynamoDB table
    queue.grantConsumeMessages(scraperRole); // Grant consume messages access to SQS queue
    scraperRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    ); // Basic Lambda execution role for logs

    // 7. Create the SQS to Lambda Trigger (Event Source Mapping)
    scraperLambda.addEventSource(new SqsEventSource(queue, {
      batchSize: 1,
    }));

    // // 8. AWS App Runner Service for the NestJS App
    // const apiService = new apprunner.Service(this, 'SmartWishlistApiService', {
    //   source: apprunner.Source.fromAsset({
    //     asset: new DockerImageAsset(this, 'SmartWishlistApiImage', {
    //       directory: path.join(__dirname, '../../server'),
    //     }),
    //     imageConfiguration: { 
    //       port: 3000,
    //       environmentVariables: {
    //         AWS_REGION: this.region,
    //         COGNITO_USER_POOL_ID: userPool.userPoolId,
    //         COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
    //         SQS_QUEUE_URL: queue.queueUrl,
    //       },
    //     },
    //   }),
    //   cpu: apprunner.Cpu.QUARTER_VCPU, // 0.25 vCPU
    //   memory: apprunner.Memory.HALF_GB, // 0.5 GB
    //   autoDeploymentsEnabled: true,
    // });

    // 8a. ECR Repository for the NestJS App
    const apiRepository = new ecr.Repository(this, 'SmartWishlistApiRepo', {
      repositoryName: 'smart-wishlist-api',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
    });

    // 8b. AWS App Runner Service for the NestJS App
    const apiService = new apprunner.Service(this, 'SmartWishlistApiService', {
      source: apprunner.Source.fromEcr({ // <-- CHANGED from fromAsset
        repository: apiRepository,
        tagOrDigest: imageTag.valueAsString, // <-- Use the parameter
        imageConfiguration: { 
          port: 3000,
          environmentVariables: {
            AWS_REGION: this.region,
            COGNITO_USER_POOL_ID: userPool.userPoolId,
            COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
            SQS_QUEUE_URL: queue.queueUrl,
          },
        },
      }),
      cpu: apprunner.Cpu.QUARTER_VCPU,
      memory: apprunner.Memory.HALF_GB,
      autoDeploymentsEnabled: true,
    });

    // Grant the App Runner service permissions to talk to other services
    // Pass the service object directly to the grant methods.
    table.grantReadWriteData(apiService);
    queue.grantSendMessages(apiService);


    // 9. Outputs
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'QueueUrl', { value: queue.queueUrl });
    new cdk.CfnOutput(this, 'ApiServiceUrl', {
      value: apiService.serviceUrl,
      description: 'The public URL of the Smart Wishlist API service',
    });
  }
}
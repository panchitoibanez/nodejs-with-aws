import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
//import * as apprunner from '@aws-cdk/aws-apprunner-alpha';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export interface AppRunnerStackProps extends cdk.StackProps {
  readonly apiRepository: ecr.IRepository;
}

export class AppRunnerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppRunnerStackProps) {
    super(scope, id, props);

    const imageTag = new cdk.CfnParameter(this, 'imageTag', {
      type: 'String',
      description: 'The tag of the Docker image to deploy.',
    });

    const table = new dynamodb.Table(this, 'SmartWishlistTable', {
        tableName: 'SmartWishlistTable',
        partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
        sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

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

    const queue = new sqs.Queue(this, 'SmartWishlistQueue', {
        queueName: 'SmartWishlistQueue',
    });

    const scraperRole = new iam.Role(this, 'SmartWishlistScraperRole', {
        roleName: 'SmartWishlistScraperRole',
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    const scraperLambda = new lambda.Function(this, 'SmartWishlistScraper', {
        functionName: 'SmartWishlistScraper',
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'index.handler',
        code: lambda.Code.fromAsset(path.join(__dirname, '../../scraper-lambda')),
        role: scraperRole,
        timeout: cdk.Duration.seconds(10),
    });

    table.grantReadWriteData(scraperRole);
    queue.grantConsumeMessages(scraperRole);
    scraperRole.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );
    
    scraperLambda.addEventSource(new SqsEventSource(queue, {
        batchSize: 1,
    }));

    /*
    // Temporarily disabled due to AWS account activation issue with App Runner
    const apiService = new apprunner.Service(this, 'SmartWishlistApiService', {
      source: apprunner.Source.fromEcr({
        repository: props.apiRepository,
        tagOrDigest: imageTag.valueAsString,
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
      instanceConfiguration: {
        cpu: apprunner.Cpu.QUARTER_VCPU,
        memory: apprunner.Memory.HALF_GB,
      },
      autoDeploymentsEnabled: true,
    });
    
    table.grantReadWriteData(apiService);
    queue.grantSendMessages(apiService);
    */

    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'QueueUrl', { value: queue.queueUrl });
    /*
    new cdk.CfnOutput(this, 'ApiServiceUrl', {
      value: apiService.serviceUrl,
      description: 'The public URL of the Smart Wishlist API service',
    });
    */
  }
}
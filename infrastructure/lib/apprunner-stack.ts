import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import { HttpApi, CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';


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

    // S3 Bucket for storing product images and attachments
    const bucket = new s3.Bucket(this, 'SmartWishlistBucket', {
        bucketName: `smart-wishlist-${this.account}-${this.region}`,
        versioned: true,
        encryption: s3.BucketEncryption.S3_MANAGED,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
        lifecycleRules: [
            {
                id: 'DeleteIncompleteMultipartUploads',
                abortIncompleteMultipartUploadAfter: cdk.Duration.days(1),
            },
            {
                id: 'DeleteOldVersions',
                noncurrentVersionExpiration: cdk.Duration.days(30),
            },
        ],
    });

    // SNS Topic for notifications
    const notificationTopic = new sns.Topic(this, 'SmartWishlistNotificationTopic', {
        topicName: 'smart-wishlist-notifications',
        displayName: 'Smart Wishlist Notifications',
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

    // --- NEW: API Lambda Function ---
    const apiLambda = new lambda.DockerImageFunction(this, 'ApiLambdaFunction', {
      code: lambda.DockerImageCode.fromEcr(props.apiRepository, {
        tagOrDigest: imageTag.valueAsString,
      }),
      memorySize: 512,
      timeout: cdk.Duration.seconds(30),
      environment: {
        COGNITO_USER_POOL_ID: userPool.userPoolId,
        COGNITO_CLIENT_ID: userPoolClient.userPoolClientId,
        SQS_QUEUE_URL: queue.queueUrl,
        DYNAMODB_TABLE_NAME: table.tableName,
        S3_BUCKET_NAME: bucket.bucketName,
        SNS_TOPIC_ARN: notificationTopic.topicArn,
      },
    });

    table.grantReadWriteData(apiLambda);
    queue.grantSendMessages(apiLambda);
    bucket.grantReadWrite(apiLambda);
    notificationTopic.grantPublish(apiLambda);

    // --- NEW: API Gateway to trigger the Lambda ---
    const httpApi = new HttpApi(this, 'SmartWishlistHttpApi', {
      apiName: 'smart-wishlist-api',
      corsPreflight: {
        allowHeaders: ['Content-Type', 'Authorization'],
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.PATCH,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.OPTIONS,
        ],
        allowOrigins: ['*'], // In production, restrict this to your frontend's domain
      },
      defaultIntegration: new HttpLambdaIntegration(
        'DefaultIntegration',
        apiLambda,
      ),
    });
    
    new cdk.CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
    new cdk.CfnOutput(this, 'UserPoolClientId', { value: userPoolClient.userPoolClientId });
    new cdk.CfnOutput(this, 'QueueUrl', { value: queue.queueUrl });
    new cdk.CfnOutput(this, 'BucketName', { 
      value: bucket.bucketName,
      description: 'S3 bucket name for storing product images and attachments',
    });
    new cdk.CfnOutput(this, 'NotificationTopicArn', { 
      value: notificationTopic.topicArn,
      description: 'SNS topic ARN for sending notifications',
    });
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.url!,
      description: 'The public URL of the Smart Wishlist API Gateway',
    });
  }
}
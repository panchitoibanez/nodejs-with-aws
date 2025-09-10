import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';

export class EcrStack extends cdk.Stack {
  public readonly repository: ecr.IRepository;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.repository = new ecr.Repository(this, 'SmartWishlistApiRepo', {
      repositoryName: 'smart-wishlist-api',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteImages: true,
    });

    new cdk.CfnOutput(this, 'ApiRepositoryName', { 
      value: this.repository.repositoryName,
      description: 'The name of the ECR repository for the API service',
    });
  }
}
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AppRunnerStack } from '../lib/apprunner-stack';
import { EcrStack } from '../lib/ecr-stack';

const app = new cdk.App();

// Create the ECR stack first
const ecrStack = new EcrStack(app, 'EcrStack');

// Create the App Runner stack and pass the ECR repository to it
const appRunnerStack = new AppRunnerStack(app, 'AppRunnerStack', {
  apiRepository: ecrStack.repository,
});

// Add a dependency to ensure ECR stack is deployed before App Runner stack
appRunnerStack.addDependency(ecrStack);
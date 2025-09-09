# My Learnings

This file is a personal knowledge base to track key concepts, commands, and resources discovered during the "Smart Wishlist" project.

## Week 1: Foundations

- **Git & GitHub**:
  - `git init`: Initializes a new Git repository.
  - `git add <file>`: Stages a file for the next commit.
  - `git commit -m "message"`: Records the staged changes.
  - `git push`: Uploads local commits to a remote repository.
- **Node.js & TypeScript**:
  - *Links to be added.*
- **NestJS Fundamentals**:
  - *Links to be added.*
- **Docker**:
  - *Links to be added.*
- **Code Quality**:
  - **ESLint**: A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code, with the goal of making code more consistent and avoiding bugs.
  - **Prettier**: An opinionated code formatter that enforces a consistent style by parsing your code and re-printing it.
  - **Linting Fixes**: Solved a "floating promise" in `main.ts` by adding a `.catch()` block. Fixed "unsafe" type errors in e2e tests by simplifying type definitions and correcting the `supertest` import.
- **Git**:
  - **Nested Repository**: If a sub-directory has its own `.git` folder, the parent repository treats it as a submodule. This can be fixed by removing the nested `.git` directory (`rm -rf path/to/sub/.git`).
  - **Conventional Commits**: A specification for adding human and machine-readable meaning to commit messages. (e.g., `feat:`, `fix:`, `chore:`). [Link](https://www.conventionalcommits.org/)

## Week 2: User Authentication

- **AWS CLI**: The command-line tool to manage AWS services. We used it for installation, configuration (`aws configure`), and creating Cognito resources. [Official Docs](https://aws.amazon.com/cli/)
- **IAM (Identity and Access Management)**: The AWS service for managing user access and permissions. We created an IAM user with programmatic access (`Access Key ID` & `Secret Access Key`) for our development machine, which is a security best practice.
- **AWS Cognito**: A managed user identity service.
  - **User Pool**: A user directory in Cognito. It handles user registration, authentication, and profile storage.
  - **User Pool Client**: An entity within a User Pool that has permission to call unauthenticated API operations (like sign-up and sign-in).
- **NestJS ConfigModule**: A module to manage application configuration and environment variables. We used it to load our Cognito IDs from a `.env` file.
- **DTOs (Data Transfer Objects)**: Classes that define the shape of data for network requests. Used with `class-validator` decorators, they provide automatic request payload validation.
- **Cognito User States**:
  - **`UNCONFIRMED`**: The initial state of a user after sign-up, before they have verified their email.
  - **`UserNotConfirmedException`**: The error Cognito returns when an unconfirmed user tries to sign in.
  - **`admin-confirm-sign-up`**: The AWS CLI command to manually confirm a user, useful for development.
- **JWT (JSON Web Token)**: A standard for securely transmitting information between parties as a JSON object. We get an `AccessToken`, `IdToken`, and `RefreshToken` from Cognito.
- **NestJS Guards**: Classes that determine whether a given request will be handled by the route handler or not. They are used to implement authorization.
  - **`@UseGuards()`**: The decorator to apply a guard to a specific endpoint.
- **JWT Verification**: The process of validating a token's signature to ensure it was issued by a trusted source (our Cognito User Pool) and has not been tampered with.
  - **JWKS (JSON Web Key Set)**: A set of public keys used to verify JWT signatures. We fetch this from a public URL provided by Cognito.

## Week 3: Core Wishlist API

- **Amazon DynamoDB**: A fully managed, serverless, NoSQL database.
  - **Single-Table Design**: A common DynamoDB pattern where different types of data are stored in a single table, distinguished by their Primary Keys.
  - **PK (Partition Key) / SK (Sort Key)**: The composite primary key used to uniquely identify items and model one-to-many relationships.
  - **Billing Mode**: We used `PAY_PER_REQUEST`, which is ideal for development and applications with unpredictable workloads.
- **DynamoDB Document Client**: A higher-level client from the AWS SDK (`@aws-sdk/lib-dynamodb`) that allows working with native JavaScript objects instead of the low-level DynamoDB format.
- **CRUD with DynamoDB**:
  - **Create**: `PutCommand` inserts or replaces an entire item.
  - **Read**: `QueryCommand` efficiently retrieves a collection of items with the same Partition Key.
  - **Update**: `UpdateCommand` modifies specific attributes of an existing item. We used `UpdateExpression` and `ConditionExpression` for safe updates.
  - **Delete**: `DeleteCommand` removes an item. We used `ConditionExpression` to ensure the item exists before deleting.
- **NestJS Route Parameters**:
  - **`@Param('id')`**: Decorator to extract a parameter from the URL (e.g., the `:id` in `@Delete(':id')`).
  - **`ParseUUIDPipe`**: A built-in pipe to automatically validate that a route parameter is a valid UUID.

## Week 4: Asynchronous Processing

- **Decoupled Architecture**: A design principle where different components of a system are loosely connected. This improves scalability and resilience. We decoupled the slow web scraping from the initial user request.
- **AWS SQS (Simple Queue Service)**: A fully managed message queuing service. It enables asynchronous communication between different software components. We used it to send "scrape URL" jobs to a background worker.
- **AWS Lambda**: A serverless compute service that runs your code in response to triggers. This is the core of our background processing.
- **IAM Roles for Services**: Instead of giving credentials to a service, we create an IAM Role that the service "assumes". This is a secure way to grant permissions.
  - **Trust Policy**: Defines which principals (e.g., `lambda.amazonaws.com`) are allowed to assume the role.
  - **Permissions Policy**: Defines what actions the principal is allowed to perform on which resources.
- **Lambda Event Source Mapping**: The trigger that connects an event source (like an SQS queue) to a Lambda function, causing the function to be invoked when new events occur.

## Week 5: Infrastructure as Code (IaC)

- **AWS CDK (Cloud Development Kit)**: A framework for defining your cloud infrastructure in code using familiar programming languages. This enables repeatability, version control, and automation.
- **CDK Concepts**:
  - **Constructs**: The building blocks of the CDK. Each construct represents an AWS resource (e.g., `new dynamodb.Table(...)`).
  - **Stack**: A collection of related constructs that are deployed together as a single unit (our `InfrastructureStack`).
  - **`cdk bootstrap`**: A one-time command that provisions the necessary resources (S3 bucket, IAM roles) for the CDK to perform deployments in an AWS account/region.
  - **`cdk synth`**: Synthesizes the CDK code into a low-level AWS CloudFormation template.
  - **`cdk diff`**: Compares the stack defined in your code against what's currently deployed in AWS.
  - **`cdk deploy`**: Deploys your stack to AWS.
- **CDK Best Practices**:
  - **Removal Policy**: Setting `removalPolicy: cdk.RemovalPolicy.DESTROY` is useful for development stacks to ensure easy cleanup.
  - **High-Level Grant Methods**: Using methods like `table.grantWriteData(role)` is a secure and readable way to manage IAM permissions.
  - **`CfnOutput`**: Used to export important values (like resource IDs and URLs) from your stack after deployment.

## Week 6: Automation & CI/CD

- **GitHub Actions**: A CI/CD platform integrated into GitHub. We used it to automate our testing and deployment processes.
- **Workflow**: A set of automated jobs defined in a YAML file (e.g., `deploy.yml`).
  - **`on: push: branches: [main]`**: The trigger that starts the workflow.
  - **`jobs`**: A workflow is made up of one or more jobs that run independently by default.
  - **`needs: test`**: A keyword to create a dependency, ensuring one job runs only after another succeeds.
  - **`working-directory`**: A directive to run a command in a specific subdirectory.
- **Passwordless Authentication (OIDC)**: The secure, modern way to authenticate a CI/CD pipeline with a cloud provider. We created an IAM Role that explicitly trusts GitHub Actions for our specific repository, eliminating the need for long-lived secret keys.
- **`npm ci`**: A command similar to `npm install`, but it is designed for automated environments. It's generally faster and more reliable as it installs dependencies exactly as defined in the `package-lock.json` file.

---
*This document will be updated as we progress through the project.*

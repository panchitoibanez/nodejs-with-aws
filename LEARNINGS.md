# My Learnings

This file is a personal knowledge base to track key concepts, commands, and resources discovered during the "Smart Wishlist" project.

## Week 1: Foundations

- **Git & GitHub**:
  - **Concept**: A distributed version control system. The core workflow involves moving changes from your working directory to a staging area (`git add`), committing them to your local repository (`git commit`), and then synchronizing them with a remote repository like GitHub (`git push`).
  - **Nested Repository**: If a sub-directory has its own `.git` folder, the parent repository treats it as a submodule. This can complicate tracking. Fixed by removing the nested `.git` directory (`rm -rf path/to/sub/.git`).
  - **Conventional Commits**: A specification for commit messages that creates an explicit history, making it easier to automate changelogs and understand changes. (e.g., `feat:`, `fix:`, `chore:`, `docs:`).
  - **[Official Git Documentation](https://git-scm.com/doc)**
  - **[Conventional Commits Specification](https://www.conventionalcommits.org/)**

- **NestJS Fundamentals**:
  - **Concept**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications. It uses TypeScript and is heavily inspired by Angular.
  - **Core Components**:
    - **Modules**: Organize code into cohesive blocks of functionality.
    - **Controllers**: Handle incoming requests and return responses.
    - **Services**: Handle business logic, which is then injected into controllers.
  - **[Official NestJS Documentation](https://docs.nestjs.com/)**

- **Code Quality**:
  - **ESLint**: A pluggable and configurable linter tool for statically analyzing code to quickly find problems. It helps enforce coding standards and avoid common errors.
  - **Prettier**: An opinionated code formatter that enforces a consistent style by parsing your code and re-printing it. It removes all original styling and ensures that all outputted code conforms to a consistent style.
  - **Linting Fixes**: Solved a "floating promise" in `main.ts` by adding a `.catch()` block to handle potential errors from the application startup. Fixed "unsafe" type errors in e2e tests by simplifying type definitions and correcting the `supertest` import.
  - **[ESLint Official Website](https://eslint.org/)**
  - **[Prettier Official Website](https://prettier.io/)**

## Week 2: User Authentication

- **AWS CLI**:
  - **Concept**: A unified command-line tool to manage your AWS services. `aws configure` is a key command that sets up your credentials in `~/.aws/credentials` and default region in `~/.aws/config`.
  - **[Official AWS CLI Documentation](https://aws.amazon.com/cli/)**

- **IAM (Identity and Access Management)**:
  - **Concept**: The AWS service for securely managing access to AWS services and resources.
  - **User vs. Role**: An IAM User has permanent credentials and represents a person or application. An IAM Role is an identity with permissions that can be assumed by trusted entities, which is more secure and temporary. We created a User with programmatic access for local development.
  - **[Official IAM Documentation](https://docs.aws.amazon.com/iam/)**

- **AWS Cognito**:
  - **Concept**: A managed user identity and data synchronization service.
  - **User Pool**: A user directory in Cognito. It handles user registration, authentication, profile storage, and federation with other identity providers.
  - **User Pool Client**: An entity within a User Pool that has permission to call unauthenticated API operations (like sign-up and sign-in) and defines the authentication flows (e.g., allowing user/password auth).
  - **[Official Cognito Documentation](https://docs.aws.amazon.com/cognito/index.html)**

- **NestJS & Configuration**:
  - **ConfigModule**: A module to manage application configuration. It can load variables from `.env` files and makes them accessible throughout the application via an injectable `ConfigService`.
  - **DTOs (Data Transfer Objects)**: Classes that define the shape of data for network requests. Used with `class-validator` and `class-transformer`, they provide automatic, declarative validation of request payloads.
  - **[NestJS ConfigModule Docs](https://docs.nestjs.com/techniques/configuration)**
  - **[class-validator on npm](https://www.npmjs.com/package/class-validator)**

- **JWT (JSON Web Token)**:
  - **Concept**: An open standard (RFC 7519) for securely transmitting information between parties as a JSON object. It is stateless, meaning the server does not need to store session information. A JWT consists of three parts: Header, Payload, and Signature.
  - **JWT Verification**: To ensure a token is valid, we verify its signature. This involves fetching a public key from a JWKS (JSON Web Key Set) URL provided by the issuer (Cognito) and using it to validate the token's signature.
  - **[JWT Official Website](https://jwt.io/)**

- **NestJS Guards**:
  - **Concept**: Classes that implement the `CanActivate` interface to determine if a given request will be handled by the route handler. They are the primary tool for implementing authorization.
  - **[Official NestJS Guards Documentation](https://docs.nestjs.com/guards)**

## Week 3: Core Wishlist API

- **Amazon DynamoDB**:
  - **Concept**: A fully managed, serverless, key-value NoSQL database designed for high-performance applications at any scale.
  - **Single-Table Design**: A pattern where different types of data are stored in a single table, using generic primary key names (like `PK` and `SK`) to model complex relationships and enable efficient data retrieval with a single query.
  - **Document Client**: A higher-level client in the AWS SDK (`@aws-sdk/lib-dynamodb`) that automatically handles the marshalling of JavaScript objects to and from the low-level DynamoDB data format.
  - **[Official DynamoDB Documentation](https://docs.aws.amazon.com/dynamodb/)**

- **NestJS Pipes**:
  - **Concept**: Classes that implement the `PipeTransform` interface. They operate on the arguments being processed by a route handler and are used for transformation (e.g., string to integer) and validation (e.g., checking if an argument is valid). `ParseUUIDPipe` is a built-in pipe that validates a string is a UUID.
  - **[Official NestJS Pipes Documentation](https://docs.nestjs.com/pipes)**

## Week 4: Asynchronous Processing

- **Decoupled Architecture**:
  - **Concept**: A design principle where components are loosely connected, communicating asynchronously (e.g., via a message queue). This improves scalability, resilience, and fault tolerance, as the failure of one component is less likely to cascade to others.
- **AWS SQS (Simple Queue Service)**:
  - **Concept**: A fully managed message queuing service for decoupling and scaling microservices, distributed systems, and serverless applications. We used a standard queue for our background jobs.
  - **[Official SQS Documentation](https://docs.aws.amazon.com/sqs/)**
- **AWS Lambda**:
  - **Concept**: A serverless, event-driven compute service that lets you run code for virtually any type of application or backend service without provisioning or managing servers. You only pay for the compute time you consume.
  - **[Official Lambda Documentation](https://docs.aws.amazon.com/lambda/)**
- **IAM Roles for Services**:
  - **Concept**: Instead of embedding credentials in a service, we create an IAM Role that the service "assumes". This is the standard, secure way to grant AWS services permissions to interact with each other.
  - **Trust Policy**: Defines which principals (e.g., `lambda.amazonaws.com`) are allowed to assume the role.
  - **Permissions Policy**: Defines what actions the role is allowed to perform.
- **Lambda Event Source Mapping**:
  - **Concept**: The trigger that connects an event source (like SQS) to a Lambda function. It is a resource that reads items from the source and invokes the Lambda function synchronously.
  - **[Official Event Source Mapping Documentation](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html)**

## Week 5: Infrastructure as Code (IaC)

- **AWS CDK (Cloud Development Kit)**:
  - **Concept**: A framework for defining cloud infrastructure in code and provisioning it through AWS CloudFormation. It allows you to use familiar programming languages to model your application's infrastructure.
  - **CDK App Lifecycle**: You write CDK code -> `cdk synth` synthesizes it into a CloudFormation template -> `cdk deploy` deploys that template to your AWS account.
  - **Constructs**: The building blocks of the CDK. L1 constructs map directly to CloudFormation resources. L2/L3 constructs are higher-level abstractions with sensible defaults and helper methods (like `.grantReadWriteData()`).
  - **[Official CDK Documentation](https://docs.aws.amazon.com/cdk/v2/guide/home.html)**

## Week 6 & 7: CI/CD, Containerization & Deployment

- **GitHub Actions & CI/CD**:
  - **Concept**: A CI/CD platform to automate your build, test, and deployment pipeline. A **workflow** is defined in YAML and is triggered by events. Workflows run on **runners** and are composed of **jobs**, which contain a sequence of **steps**.
  - **OIDC (OpenID Connect)**: The secure, modern way to authenticate a CI/CD pipeline. GitHub Actions gets a temporary token from its OIDC provider, which AWS is configured to trust, and exchanges it for temporary AWS credentials, eliminating the need for long-lived secrets.
  - **`npm ci`**: The recommended command for installing dependencies in automated environments. It is faster and more reliable than `npm install` because it installs dependencies directly from the `package-lock.json` file.
  - **[Official GitHub Actions Documentation](https://docs.github.com/en/actions)**
  - **[Configuring OIDC with AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)**

- **Docker & Containerization**:
  - **`Dockerfile`**: A script containing a series of instructions to assemble a Docker image.
  - **Multi-Stage Builds**: A `Dockerfile` pattern that uses multiple `FROM` statements. It allows you to use one stage with a full build environment to compile your code, then copy only the necessary artifacts to a smaller, leaner production stage, resulting in a much smaller final image.
  - **[Official Dockerfile Reference](https://docs.docker.com/engine/reference/builder/)**

- **Amazon ECR (Elastic Container Registry)**:
  - **Concept**: A fully managed, private container registry for your Docker images. It is integrated with AWS IAM, providing secure and fine-grained access control.
  - **[Official ECR Documentation](https://docs.aws.amazon.com/ecr/)**

- **AWS Lambda with Container Images**:
  - **Concept**: Lambda can run containerized applications using Docker images stored in ECR. This allows for larger applications and more complex dependencies than traditional Lambda packages.
  - **Lambda Base Images**: AWS provides optimized base images (`public.ecr.aws/lambda/nodejs:20-x86_64`) that include the Lambda runtime interface and are specifically designed for Lambda execution.
  - **Serverless Express Integration**: The `@codegenie/serverless-express` library bridges Express.js applications (like NestJS) with the Lambda runtime, handling the translation between HTTP requests and Lambda events.
  - **[Official Lambda Container Images Documentation](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)**

- **API Gateway HTTP API**:
  - **Concept**: A lightweight, high-performance API Gateway that provides HTTP endpoints for your Lambda functions. It's simpler and cheaper than the REST API Gateway.
  - **Default Integration**: A single `$default` route can forward all requests to a Lambda function, letting the application handle routing internally (perfect for NestJS).
  - **CORS Configuration**: Built-in CORS support for cross-origin requests from web applications.
  - **[Official API Gateway HTTP API Documentation](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)**

- **NestJS Serverless Architecture**:
  - **Lambda Handler**: A dedicated `lambda.ts` file that bootstraps the NestJS application and handles Lambda events using `serverless-express`.
  - **Express Adapter**: NestJS uses the Express adapter to integrate with the Express.js instance that `serverless-express` expects.
  - **Caching**: The Lambda handler caches the initialized NestJS application to avoid cold start overhead on subsequent invocations.
  - **Environment Detection**: The application can detect if it's running in Lambda vs. local development using environment variables.

- **Advanced CDK & Deployment Patterns**:
  - **Multiple Stacks**: Splitting a large application into smaller, independent stacks (`EcrStack`, `AppRunnerStack`) improves organization, allows for independent deployment, and isolates failures. `stackB.addDependency(stackA)` ensures correct deployment order.
  - **`cdk deploy StackName --exclusively`**: Deploys *only* the specified stack, ignoring its dependencies. This is crucial for preventing parameter validation errors in multi-stack CI/CD pipelines.
  - **Manual Cleanup**: A failed CloudFormation rollback can leave resources behind (e.g., CloudWatch Log Groups). These "orphaned" resources must be manually deleted from the AWS Console before a subsequent deployment can succeed.

- **Real-World Problem Solving**:
  - **Service Activation Issues**: Some AWS services (like App Runner) may require account-level activation or have restrictions on new accounts. This can block deployments even with correct code and permissions.
  - **Architecture Pivots**: When encountering service limitations, the ability to pivot to alternative architectures (App Runner → Lambda + API Gateway) demonstrates senior-level problem-solving skills.
  - **Library Selection**: Choosing the correct libraries (`@vendia/serverless-express` vs. alternatives) is crucial for stability and compatibility with AWS services.
  - **Base Image Selection**: Using AWS-provided Lambda base images instead of generic Docker images ensures proper runtime integration and compatibility.

---
*This document will be updated as we progress through the project.*

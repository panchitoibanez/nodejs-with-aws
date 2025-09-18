# Project: Smart Wishlist Service

This document tracks the goals, architecture, and key decisions for the "Smart Wishlist" service. Its purpose is to provide a high-level overview for understanding the system's design and function.

## 1. Core Idea & User Flow

The "Smart Wishlist" is a cloud-native application that allows users to create and manage wishlists. The core feature is its ability to automatically scrape and populate product details from a provided URL, creating a rich, automated user experience.

**The primary user flow is as follows:**
1.  A user signs up and signs in to the service, receiving a JWT for authentication.
2.  The user creates a named wishlist (e.g., "My Birthday Tech").
3.  The user adds a new item to the wishlist by providing a URL to a product page.
4.  The system immediately accepts the request and, in the background, asynchronously scrapes the URL for product details (name, price, image).
5.  The user can view their wishlists and see the automatically populated details for each item.

## 2. System Architecture

The application is designed using a decoupled, microservices-oriented architecture running entirely on serverless AWS services. This design prioritizes scalability, resilience, and cost-effectiveness.

- **Synchronous Operations (API)**: User-facing requests (auth, wishlist management) are handled by a containerized NestJS application running on **AWS Lambda** with **API Gateway**. This service handles all business logic and interacts directly with the **DynamoDB** database and **Cognito** for authentication.
- **Asynchronous Operations (Scraping)**: When a user adds a new item, the NestJS application does not perform the scraping directly. Instead, it sends a message containing the job details to an **SQS Queue**. An **AWS Lambda** function is subscribed to this queue, which processes the job, performs the scraping, and updates the item's status in DynamoDB. This ensures the API remains fast and responsive, regardless of how long the scraping process takes.

## 3. Tech Stack & Justification

- **Backend Framework**: **NestJS** - A robust and scalable Node.js framework that provides a clean, modular architecture out of the box using TypeScript.
- **Authentication**: **AWS Cognito** - A fully managed identity service that handles all aspects of user sign-up, sign-in, and JWT management, offloading complex security work.
- **Database**: **Amazon DynamoDB** - A serverless NoSQL database that offers single-digit millisecond performance at any scale. Its key-value nature and pay-per-request model are ideal for our access patterns.
- **Asynchronous Processing**: **AWS SQS & Lambda** - A classic serverless pattern. SQS provides a durable, reliable message queue, while Lambda offers cost-effective, event-driven compute for our background scraper.
- **Compute**: **AWS Lambda** - A serverless compute service that runs our containerized NestJS application on-demand, providing automatic scaling and cost-effective execution.
- **API Gateway**: **AWS API Gateway HTTP API** - A lightweight, high-performance API Gateway that provides HTTP endpoints for our Lambda function, handling routing and CORS configuration.
- **Container Registry**: **Amazon ECR** - A secure, private registry for our Docker images, tightly integrated with other AWS services.
- **Infrastructure as Code**: **AWS CDK (TypeScript)** - Allows us to define our entire cloud infrastructure in a familiar programming language, enabling version control, repeatability, and automated deployments.
- **Containerization**: **Docker** - The standard for packaging our application and its dependencies into a portable, reproducible container image.
- **CI/CD**: **GitHub Actions** - A powerful automation tool integrated into our repository, enabling a complete, automated pipeline for testing, building, and deploying our application.

## 4. Milestones & Key Accomplishments

- [x] **Week 1: Foundations**
  - Initialized a monorepo structure.
  - Set up a NestJS project with TypeScript.
  - Integrated ESLint and Prettier for consistent code quality.
  - Established the Git repository on GitHub with a conventional commit strategy.

- [x] **Week 2: User Authentication**
  - Provisioned an AWS Cognito User Pool and App Client.
  - Implemented `/signup` and `/signin` endpoints in the `AuthController`.
  - Created a JWT-based `AuthGuard` to protect private routes, including JWKS-based token verification.

- [x] **Week 3: Core Wishlist API**
  - Designed a single-table schema for DynamoDB using `PK` and `SK`.
  - Implemented full CRUD (Create, Read, Update, Delete) functionality for wishlists and wishlist items.
  - Used NestJS DTOs and Pipes for robust request validation.

- [x] **Week 4: Asynchronous Scraper**
  - Created an SQS queue to decouple the scraping process.
  - Wrote a Lambda function to act as the SQS message consumer.
  - Implemented the necessary IAM Roles and permissions to allow the services to communicate securely.

- [x] **Week 5: Infrastructure as Code**
  - Replicated the entire manually-created infrastructure using the AWS CDK.
  - Organized resources into a logical `InfrastructureStack`.
  - Mastered core CDK commands (`bootstrap`, `synth`, `diff`, `deploy`).

- [x] **Week 6 & 7: Automation, CI/CD & Containerization**
  - Wrote a multi-stage `Dockerfile` to create an optimized production container using AWS Lambda base images.
  - Built a multi-job GitHub Actions workflow for CI/CD.
  - Implemented a secure, passwordless OIDC connection between GitHub and AWS.
  - Configured a cloud-native build process to create and push the Docker image from the CI/CD pipeline.
  - Refactored the CDK application into multiple stacks (`EcrStack`, `AppRunnerStack`) with dependencies to solve deployment race conditions.
  - **Architecture Pivot**: Successfully pivoted from AWS App Runner to AWS Lambda + API Gateway due to account activation limitations, demonstrating real-world problem-solving skills.
  - Implemented NestJS serverless architecture using `@codegenie/serverless-express` for Lambda integration.
  - Fully automated the deployment of all backend infrastructure and container images.

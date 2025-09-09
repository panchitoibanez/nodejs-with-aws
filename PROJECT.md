# Project: Smart Wishlist Service

This document tracks the goals, architecture, and key decisions for the "Smart Wishlist" service.

## 1. Core Idea

A microservice where users can create and manage wishlists. When a user adds an item via a URL, the service automatically scrapes key product details like name, price, and image.

## 2. Tech Stack

- **Backend Framework**: NestJS
- **Authentication**: AWS Cognito
- **Database**: Amazon DynamoDB (NoSQL)
- **Asynchronous Processing**: AWS SQS + AWS Lambda
- **File Storage**: Amazon S3
- **API Layer**: Amazon API Gateway
- **Infrastructure as Code**: AWS CDK (TypeScript)
- **Containerization**: Docker
- **CI/CD**: GitHub Actions

## 3. Milestones

- [x] **Week 1: Foundations**: Project setup, NestJS initialization, linting, and Git repository.
- [x] **Week 2: User Authentication**: AWS Cognito setup, user sign-up, and user sign-in endpoints.
- [x] **Week 3: Core Wishlist API**: DynamoDB setup and full CRUD API for managing wishlists.
- [x] **Week 4: Asynchronous Scraper**: Set up an SQS queue and a Lambda function to create a decoupled, event-driven workflow for background processing.
- [x] **Week 5: Infrastructure as Code**: Recreated the entire cloud infrastructure using the AWS CDK.
- [x] **Week 6: Automation & CI/CD**: Built a complete CI/CD pipeline with GitHub Actions to automatically test and deploy the application and infrastructure.

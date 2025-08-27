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

---
*This document will be updated as we progress through the project.*

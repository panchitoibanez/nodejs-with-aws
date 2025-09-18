# AWS Lambda

## Overview

AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. Lambda automatically scales your application by running code in response to each trigger, and you only pay for the compute time you consume.

**Why Lambda Matters:**
- **Serverless**: No server management, automatic scaling, and pay-per-use pricing
- **Event-Driven**: Responds to events from AWS services and custom applications
- **Cost-Effective**: Pay only for the compute time you consume
- **Scalable**: Automatically scales from a few requests per day to thousands per second
- **Integrated**: Seamlessly integrates with other AWS services
- **Developer-Friendly**: Supports multiple programming languages and deployment methods

**Lambda Key Concepts:**
- **Functions**: The code and configuration that define your Lambda function
- **Triggers**: AWS services or custom applications that invoke your function
- **Runtime**: The programming language and version for your function
- **Execution Environment**: The environment where your function runs
- **Concurrency**: The number of function instances that can run simultaneously

## Key Concepts

### **Functions**
- **Definition**: A Lambda function is a resource that you can invoke to run your code in AWS.
- **Purpose**: Functions contain your code, dependencies, and configuration settings.
- **Deployment**: Functions can be deployed as ZIP files, container images, or layers.

**Deep Dive - Function Components:**

**Function Code:**
- **Handler**: The entry point for your function code
- **Dependencies**: Libraries and packages your function needs
- **Environment Variables**: Configuration values for your function
- **Layers**: Shared code and dependencies across multiple functions
- **Dead Letter Queues**: Handle failed function invocations

**Function Configuration:**
- **Runtime**: Programming language and version (Node.js, Python, Java, etc.)
- **Memory**: Amount of memory allocated to your function (128 MB - 10 GB)
- **Timeout**: Maximum execution time (1 second - 15 minutes)
- **Environment Variables**: Key-value pairs for configuration
- **VPC Configuration**: Network settings for VPC access
- **File System**: EFS file system access for persistent storage

**Function Limits:**
- **Function Size**: 50 MB (ZIP), 10 GB (container image)
- **Memory**: 128 MB - 10 GB
- **Timeout**: 1 second - 15 minutes
- **Environment Variables**: 4 KB total
- **Layers**: 5 layers per function
- **Concurrent Executions**: 1,000 per region (can be increased)

**Function Types:**
1. **ZIP Functions**: Deploy code as ZIP files
2. **Container Functions**: Deploy code as container images
3. **Layer Functions**: Share code and dependencies
4. **Provisioned Functions**: Reserved capacity for predictable workloads

**References:**
- [AWS Lambda Functions Documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html)
- [AWS Lambda Function Configuration](https://docs.aws.amazon.com/lambda/latest/dg/configuration-functions.html)
- [AWS Lambda Function Limits](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)

### **Runtimes**
- **Definition**: A runtime provides a language-specific environment that runs in an execution environment.
- **Purpose**: Runtimes include the language interpreter, standard libraries, and AWS SDK.
- **Management**: AWS manages runtimes, or you can use custom runtimes.

**Deep Dive - Runtime Types:**

**AWS Managed Runtimes:**
- **Node.js**: JavaScript runtime with npm package support
- **Python**: Python runtime with pip package support
- **Java**: Java runtime with Maven and Gradle support
- **C#**: .NET runtime with NuGet package support
- **Go**: Go runtime with Go modules support
- **Ruby**: Ruby runtime with gem package support
- **PowerShell**: PowerShell runtime for Windows workloads

**Custom Runtimes:**
- **Custom Runtime**: Use any programming language with custom runtime
- **Container Runtime**: Use container images with any runtime
- **Bootstrap**: Custom runtime bootstrap process
- **Runtime API**: Interface for custom runtimes

**Runtime Configuration:**
- **Version Selection**: Choose specific runtime versions
- **Package Management**: Use language-specific package managers
- **Dependencies**: Include runtime dependencies
- **Environment Variables**: Configure runtime environment
- **Bootstrap**: Custom runtime initialization

**Runtime Limits:**
- **Supported Languages**: Node.js, Python, Java, C#, Go, Ruby, PowerShell
- **Runtime Versions**: Multiple versions per language
- **Custom Runtimes**: Any language with custom runtime
- **Container Runtimes**: Any runtime in container images

**References:**
- [AWS Lambda Runtimes Documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
- [AWS Lambda Custom Runtimes](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-custom.html)
- [AWS Lambda Container Runtimes](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-images.html)

### **Triggers**
- **Definition**: A trigger is an AWS service or custom application that invokes your Lambda function.
- **Purpose**: Triggers determine when and how your function is executed.
- **Types**: Event-driven, request-response, and scheduled triggers.

**Deep Dive - Trigger Types:**

**Event-Driven Triggers:**
- **S3**: Object creation, deletion, and modification events
- **DynamoDB**: Stream events for table changes
- **SQS**: Message queue events
- **SNS**: Notification events
- **Kinesis**: Data stream events
- **EventBridge**: Custom event routing
- **Cognito**: User authentication events

**Request-Response Triggers:**
- **API Gateway**: HTTP API requests
- **Application Load Balancer**: HTTP/HTTPS requests
- **CloudFront**: Edge computing requests
- **Alexa**: Voice assistant requests
- **Lex**: Chatbot requests

**Scheduled Triggers:**
- **EventBridge Rules**: Scheduled function execution
- **CloudWatch Events**: Time-based triggers
- **Cron Expressions**: Complex scheduling patterns

**Trigger Configuration:**
- **Event Source Mapping**: Configure how events are processed
- **Batch Size**: Number of records to process per invocation
- **Parallelization**: Number of concurrent function invocations
- **Error Handling**: Dead letter queues and retry policies
- **Filtering**: Event filtering and transformation

**Trigger Limits:**
- **Event Sources**: Multiple event sources per function
- **Batch Size**: 1-10,000 records per batch
- **Parallelization**: 1-10 concurrent invocations
- **Retry Attempts**: 0-2 retry attempts
- **Dead Letter Queues**: 1 DLQ per function

**References:**
- [AWS Lambda Triggers Documentation](https://docs.aws.amazon.com/lambda/latest/dg/lambda-invocation.html)
- [AWS Lambda Event Sources](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html)
- [AWS Lambda Trigger Configuration](https://docs.aws.amazon.com/lambda/latest/dg/configuration-eventsourcemapping.html)

### **Execution Environment**
- **Definition**: The execution environment is the runtime environment where your Lambda function runs.
- **Purpose**: Provides the compute resources and runtime environment for your function.
- **Management**: AWS manages the execution environment automatically.

**Deep Dive - Execution Environment:**

**Environment Components:**
- **Compute Resources**: CPU, memory, and network resources
- **Runtime Environment**: Language runtime and libraries
- **File System**: Temporary file system (/tmp)
- **Network Access**: VPC and internet access
- **Security Context**: IAM roles and permissions

**Environment Lifecycle:**
1. **Cold Start**: Initial environment creation and function loading
2. **Warm Start**: Reuse existing environment for subsequent invocations
3. **Execution**: Function code execution
4. **Cleanup**: Environment cleanup and resource deallocation

**Performance Optimization:**
- **Cold Start Reduction**: Minimize cold start latency
- **Warm Start Optimization**: Optimize for warm start performance
- **Memory Allocation**: Right-size memory for optimal performance
- **Concurrency Management**: Manage concurrent executions
- **Provisioned Concurrency**: Reserved capacity for predictable workloads

**Environment Limits:**
- **Memory**: 128 MB - 10 GB
- **CPU**: Proportional to memory allocation
- **File System**: 512 MB - 10 GB (/tmp)
- **Network**: VPC and internet access
- **Execution Time**: 1 second - 15 minutes

**References:**
- [AWS Lambda Execution Environment](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-context.html)
- [AWS Lambda Performance Optimization](https://docs.aws.amazon.com/lambda/latest/dg/performance-optimization.html)
- [AWS Lambda Cold Starts](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html)

## Function Deployment

### **ZIP Deployment**
- **Purpose**: Deploy function code as ZIP files
- **Use Case**: Simple functions with minimal dependencies
- **Limitations**: 50 MB size limit, limited dependency management

**ZIP Deployment Deep Dive:**
- **Package Creation**: Create deployment packages with dependencies
- **Dependency Management**: Include required libraries and packages
- **Code Organization**: Organize code for optimal performance
- **Environment Variables**: Configure function environment
- **Layers**: Use layers for shared dependencies

### **Container Deployment**
- **Purpose**: Deploy function code as container images
- **Use Case**: Complex functions with large dependencies
- **Benefits**: Up to 10 GB size, custom runtimes, better dependency management

**Container Deployment Deep Dive:**
- **Base Images**: Use AWS Lambda base images or custom images
- **Image Creation**: Build and tag container images
- **Registry**: Store images in Amazon ECR
- **Deployment**: Deploy container images to Lambda
- **Optimization**: Optimize container images for performance

**Container Configuration:**
- **Base Image**: Choose appropriate base image
- **Dependencies**: Include all required dependencies
- **Entry Point**: Configure container entry point
- **Environment**: Set environment variables
- **Security**: Implement security best practices

### **Layers**
- **Purpose**: Share code and dependencies across multiple functions
- **Benefits**: Reduce deployment package size, improve reusability
- **Limitations**: 5 layers per function, 250 MB total size

**Layers Deep Dive:**
- **Layer Creation**: Create layers with shared code or dependencies
- **Layer Publishing**: Publish layers to AWS
- **Layer Usage**: Use layers in multiple functions
- **Layer Versioning**: Manage layer versions
- **Layer Optimization**: Optimize layers for performance

**Layer Types:**
1. **Runtime Layers**: Language-specific runtime components
2. **Dependency Layers**: Shared libraries and packages
3. **Custom Layers**: Application-specific shared code
4. **AWS Layers**: Pre-built layers from AWS

**References:**
- [AWS Lambda Deployment Documentation](https://docs.aws.amazon.com/lambda/latest/dg/deploying-lambda-apps.html)
- [AWS Lambda ZIP Deployment](https://docs.aws.amazon.com/lambda/latest/dg/configuration-package.html)
- [AWS Lambda Container Deployment](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)
- [AWS Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html)

## Event Sources

### **S3 Events**
- **Purpose**: Trigger functions when S3 objects are created, modified, or deleted
- **Use Case**: Image processing, file validation, data transformation
- **Configuration**: Event types, prefixes, suffixes, and filters

**S3 Events Deep Dive:**
- **Event Types**: s3:ObjectCreated, s3:ObjectRemoved, s3:ObjectRestore
- **Event Filters**: Prefix, suffix, and metadata filters
- **Batch Processing**: Process multiple events in a single invocation
- **Error Handling**: Dead letter queues and retry policies
- **Performance**: Optimize for high-volume event processing

### **DynamoDB Streams**
- **Purpose**: Trigger functions when DynamoDB table items are modified
- **Use Case**: Real-time data processing, analytics, notifications
- **Configuration**: Stream view type, batch size, and parallelization

**DynamoDB Streams Deep Dive:**
- **Stream View Types**: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES
- **Event Types**: INSERT, MODIFY, REMOVE
- **Batch Processing**: Process multiple stream records
- **Error Handling**: Handle processing failures and retries
- **Performance**: Optimize for high-throughput stream processing

### **SQS Events**
- **Purpose**: Trigger functions when SQS messages are available
- **Use Case**: Message processing, workflow orchestration, batch processing
- **Configuration**: Queue configuration, batch size, and visibility timeout

**SQS Events Deep Dive:**
- **Message Processing**: Process SQS messages in batches
- **Error Handling**: Dead letter queues and retry policies
- **Visibility Timeout**: Manage message visibility during processing
- **Batch Size**: Configure batch size for optimal performance
- **FIFO Queues**: Process messages in order with FIFO queues

### **API Gateway Events**
- **Purpose**: Trigger functions for HTTP API requests
- **Use Case**: REST APIs, web applications, microservices
- **Configuration**: HTTP methods, paths, and integration types

**API Gateway Events Deep Dive:**
- **HTTP Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Path Parameters**: Extract path parameters from requests
- **Query Parameters**: Access query string parameters
- **Headers**: Access request and response headers
- **Body**: Process request and response bodies
- **CORS**: Configure cross-origin resource sharing

**References:**
- [AWS Lambda Event Sources Documentation](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html)
- [AWS Lambda S3 Events](https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html)
- [AWS Lambda DynamoDB Streams](https://docs.aws.amazon.com/lambda/latest/dg/with-ddb.html)
- [AWS Lambda SQS Events](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)
- [AWS Lambda API Gateway Events](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)

## Performance and Optimization

### **Cold Starts**
- **Definition**: The time it takes to initialize a new execution environment
- **Impact**: Affects function latency and user experience
- **Optimization**: Minimize cold start time through various techniques

**Cold Start Optimization Deep Dive:**
- **Package Size**: Minimize deployment package size
- **Dependencies**: Reduce external dependencies
- **Initialization**: Optimize function initialization code
- **Memory Allocation**: Right-size memory allocation
- **Provisioned Concurrency**: Use provisioned concurrency for predictable workloads
- **Container Optimization**: Optimize container images for faster startup

### **Memory and CPU**
- **Memory**: Allocates memory and proportional CPU resources
- **CPU**: CPU allocation is proportional to memory allocation
- **Optimization**: Right-size memory for optimal performance and cost

**Memory and CPU Optimization Deep Dive:**
- **Memory Allocation**: Choose appropriate memory allocation (128 MB - 10 GB)
- **CPU Allocation**: CPU is proportional to memory (1 vCPU per 1,769 MB)
- **Performance Testing**: Test different memory allocations for optimal performance
- **Cost Optimization**: Balance performance and cost
- **Monitoring**: Monitor memory and CPU usage

### **Concurrency**
- **Definition**: The number of function instances that can run simultaneously
- **Limits**: Default limit of 1,000 concurrent executions per region
- **Management**: Control concurrency through reserved and provisioned concurrency

**Concurrency Management Deep Dive:**
- **Reserved Concurrency**: Reserve capacity for specific functions
- **Provisioned Concurrency**: Pre-warm function instances
- **Concurrency Limits**: Set concurrency limits per function
- **Throttling**: Handle throttling when limits are exceeded
- **Scaling**: Automatic scaling based on demand

### **Monitoring and Debugging**
- **CloudWatch**: Monitor function metrics and logs
- **X-Ray**: Distributed tracing for function execution
- **Debugging**: Debug function issues and performance problems

**Monitoring and Debugging Deep Dive:**
- **CloudWatch Metrics**: Monitor invocation count, duration, errors, and throttles
- **CloudWatch Logs**: View function execution logs
- **X-Ray Tracing**: Trace function execution and dependencies
- **Error Handling**: Implement proper error handling and logging
- **Performance Monitoring**: Monitor function performance and optimization

**References:**
- [AWS Lambda Performance Optimization](https://docs.aws.amazon.com/lambda/latest/dg/performance-optimization.html)
- [AWS Lambda Cold Starts](https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html)
- [AWS Lambda Monitoring](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-functions.html)
- [AWS Lambda Debugging](https://docs.aws.amazon.com/lambda/latest/dg/troubleshooting-debugging.html)

## Security

### **IAM Roles**
- **Purpose**: Control what AWS resources your function can access
- **Configuration**: Attach IAM roles to functions for permissions
- **Best Practices**: Use least privilege principle

**IAM Role Security Deep Dive:**
- **Execution Role**: IAM role for function execution
- **Resource Access**: Control access to AWS services and resources
- **Cross-Service Access**: Access other AWS services from functions
- **VPC Access**: Access VPC resources with appropriate permissions
- **Secrets Management**: Use AWS Secrets Manager for sensitive data

### **VPC Configuration**
- **Purpose**: Access VPC resources from Lambda functions
- **Configuration**: Configure VPC settings for function execution
- **Security**: Implement network security best practices

**VPC Security Deep Dive:**
- **VPC Configuration**: Configure VPC, subnets, and security groups
- **Network Access**: Control network access to and from functions
- **Security Groups**: Configure security group rules
- **NAT Gateway**: Use NAT gateway for internet access
- **Private Subnets**: Deploy functions in private subnets

### **Environment Variables**
- **Purpose**: Store configuration values for functions
- **Security**: Encrypt sensitive environment variables
- **Management**: Use AWS Systems Manager Parameter Store or Secrets Manager

**Environment Variable Security Deep Dive:**
- **Encryption**: Encrypt sensitive environment variables
- **Parameter Store**: Use Systems Manager Parameter Store
- **Secrets Manager**: Use AWS Secrets Manager for secrets
- **Rotation**: Implement secret rotation
- **Access Control**: Control access to environment variables

**References:**
- [AWS Lambda Security Documentation](https://docs.aws.amazon.com/lambda/latest/dg/security.html)
- [AWS Lambda IAM Roles](https://docs.aws.amazon.com/lambda/latest/dg/configuration-roles.html)
- [AWS Lambda VPC Configuration](https://docs.aws.amazon.com/lambda/latest/dg/configuration-vpc.html)
- [AWS Lambda Environment Variables](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)

## Common Use Cases in Our Project

### **1. API Backend**
- **Purpose**: Handle HTTP requests from API Gateway
- **Configuration**: Node.js runtime, API Gateway integration
- **Features**: JWT validation, business logic, database operations

**Detailed API Backend Implementation:**
- **Runtime**: Node.js 20.x with NestJS framework
- **Handler**: Express-based handler using serverless-express
- **Authentication**: JWT token validation with Cognito
- **Database**: DynamoDB operations for wishlist management
- **Messaging**: SQS integration for asynchronous processing
- **Error Handling**: Comprehensive error handling and logging

### **2. Message Processing**
- **Purpose**: Process SQS messages for wishlist item scraping
- **Configuration**: Node.js runtime, SQS event source
- **Features**: Message processing, DynamoDB updates, error handling

**Detailed Message Processing Implementation:**
- **Runtime**: Node.js 20.x
- **Event Source**: SQS queue for wishlist item processing
- **Processing**: Parse messages, simulate scraping, update DynamoDB
- **Error Handling**: Dead letter queue for failed messages
- **Monitoring**: CloudWatch logging and metrics

### **3. Container Deployment**
- **Purpose**: Deploy NestJS application as container image
- **Configuration**: Container image deployment, ECR integration
- **Features**: Multi-stage builds, optimized images, Lambda integration

**Detailed Container Deployment Implementation:**
- **Base Image**: AWS Lambda Node.js base image
- **Multi-stage Build**: Optimized production image
- **Registry**: Amazon ECR for image storage
- **Deployment**: CDK deployment with container images
- **Optimization**: Minimized image size and cold start time

**References:**
- [AWS Lambda API Backend](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)
- [AWS Lambda Message Processing](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)
- [AWS Lambda Container Deployment](https://docs.aws.amazon.com/lambda/latest/dg/images-create.html)

## Best Practices

### **Development Best Practices**
1. **Function Design**: Design functions for single responsibility
2. **Error Handling**: Implement comprehensive error handling
3. **Logging**: Use structured logging for debugging
4. **Testing**: Implement unit and integration tests
5. **Monitoring**: Monitor function performance and errors

**Advanced Development Practices:**
- **Function Composition**: Compose complex workflows from simple functions
- **State Management**: Use external state stores for complex state
- **Dependency Management**: Minimize dependencies and use layers
- **Code Organization**: Organize code for maintainability and reusability
- **Versioning**: Implement proper versioning and deployment strategies

### **Performance Best Practices**
1. **Memory Allocation**: Right-size memory for optimal performance
2. **Cold Start Optimization**: Minimize cold start latency
3. **Concurrency Management**: Manage concurrency effectively
4. **Monitoring**: Monitor performance metrics and optimize
5. **Caching**: Implement caching for frequently accessed data

**Advanced Performance Practices:**
- **Provisioned Concurrency**: Use for predictable workloads
- **Reserved Concurrency**: Reserve capacity for critical functions
- **Connection Pooling**: Reuse database connections
- **Lazy Loading**: Load dependencies only when needed
- **Performance Testing**: Regular performance testing and optimization

### **Security Best Practices**
1. **IAM Roles**: Use least privilege principle
2. **Environment Variables**: Encrypt sensitive data
3. **VPC Configuration**: Secure network access
4. **Input Validation**: Validate all inputs
5. **Error Handling**: Don't expose sensitive information in errors

**Advanced Security Practices:**
- **Secrets Management**: Use AWS Secrets Manager
- **Parameter Store**: Use Systems Manager Parameter Store
- **VPC Security**: Implement proper VPC security
- **Network Security**: Use security groups and NACLs
- **Audit Logging**: Implement comprehensive audit logging

**References:**
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [AWS Lambda Performance Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/performance-optimization.html)
- [AWS Lambda Security Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/security.html)

## Monitoring and Debugging

### **CloudWatch Integration**
- **Metrics**: Monitor function metrics and performance
- **Logs**: View function execution logs
- **Alarms**: Set up alarms for important metrics
- **Dashboards**: Create monitoring dashboards

**CloudWatch Deep Dive:**
- **Function Metrics**: Invocation count, duration, errors, throttles
- **Custom Metrics**: Publish custom metrics from functions
- **Log Groups**: Automatic log group creation
- **Log Streams**: Separate log streams per function instance
- **Alarms**: Set up alarms for threshold breaches
- **Dashboards**: Create comprehensive monitoring dashboards

### **X-Ray Integration**
- **Tracing**: Distributed tracing for function execution
- **Performance**: Analyze function performance and bottlenecks
- **Dependencies**: Trace calls to other AWS services
- **Debugging**: Debug complex distributed applications

**X-Ray Deep Dive:**
- **Trace Collection**: Automatic trace collection for supported services
- **Custom Traces**: Add custom traces to your code
- **Service Map**: Visualize service dependencies
- **Performance Analysis**: Analyze performance bottlenecks
- **Error Analysis**: Identify and debug errors
- **Sampling**: Control trace sampling for cost optimization

### **Debugging Tools**
- **CloudWatch Logs**: View and search function logs
- **X-Ray Traces**: Trace function execution
- **Lambda Console**: Test and debug functions
- **Local Testing**: Test functions locally before deployment

**Debugging Deep Dive:**
- **Log Analysis**: Analyze function logs for issues
- **Trace Analysis**: Use X-Ray traces for debugging
- **Error Handling**: Implement proper error handling and logging
- **Local Testing**: Use SAM CLI for local testing
- **Performance Profiling**: Profile function performance
- **Memory Profiling**: Analyze memory usage and leaks

**References:**
- [AWS Lambda Monitoring](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-functions.html)
- [AWS Lambda CloudWatch Integration](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-cloudwatch.html)
- [AWS Lambda X-Ray Integration](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-xray.html)
- [AWS Lambda Debugging](https://docs.aws.amazon.com/lambda/latest/dg/troubleshooting-debugging.html)

## Cost Optimization

### **Pricing Model**
- **Compute Time**: Pay for compute time consumed
- **Requests**: Pay for number of requests
- **Memory**: Pay based on memory allocation
- **Duration**: Pay based on function execution time

**Pricing Deep Dive:**
- **Compute Time**: $0.0000166667 per GB-second
- **Requests**: $0.20 per 1M requests
- **Free Tier**: 1M free requests and 400,000 GB-seconds per month
- **Provisioned Concurrency**: Additional cost for provisioned concurrency
- **Data Transfer**: Cost for data transfer out of AWS

### **Cost Optimization Strategies**
1. **Memory Optimization**: Right-size memory allocation
2. **Duration Optimization**: Optimize function execution time
3. **Concurrency Management**: Manage concurrency effectively
4. **Provisioned Concurrency**: Use only when necessary
5. **Monitoring**: Monitor costs and usage patterns

**Advanced Cost Optimization:**
- **Memory Right-Sizing**: Test different memory allocations
- **Duration Optimization**: Optimize code for faster execution
- **Concurrency Limits**: Set appropriate concurrency limits
- **Reserved Capacity**: Use reserved capacity for predictable workloads
- **Cost Monitoring**: Monitor costs and usage patterns
- **Cost Alerts**: Set up cost alerts and budgets

**References:**
- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)
- [AWS Lambda Cost Optimization](https://docs.aws.amazon.com/lambda/latest/dg/optimizing-costs.html)

## Advanced Topics

### **Lambda@Edge**
- **Purpose**: Run Lambda functions at CloudFront edge locations
- **Use Case**: Content customization, authentication, A/B testing
- **Limitations**: Limited runtime support, smaller package size

**Lambda@Edge Deep Dive:**
- **Edge Locations**: Run functions closer to users
- **Event Types**: Viewer request, origin request, origin response, viewer response
- **Runtime Support**: Node.js and Python runtimes
- **Package Size**: 1 MB for viewer events, 50 MB for origin events
- **Execution Time**: 5 seconds for viewer events, 30 seconds for origin events

### **Lambda Extensions**
- **Purpose**: Extend Lambda runtime with additional capabilities
- **Use Case**: Monitoring, logging, security, observability
- **Types**: Internal and external extensions

**Lambda Extensions Deep Dive:**
- **Extension Types**: Internal and external extensions
- **Extension Lifecycle**: Initialize, invoke, shutdown phases
- **Extension APIs**: Runtime API and extensions API
- **Use Cases**: Monitoring, logging, security, observability
- **Performance**: Extensions run in parallel with function execution

### **Lambda Destinations**
- **Purpose**: Send function results to other AWS services
- **Use Case**: Event routing, workflow orchestration, notifications
- **Types**: Asynchronous and synchronous destinations

**Lambda Destinations Deep Dive:**
- **Asynchronous Destinations**: SQS, SNS, EventBridge, Lambda
- **Synchronous Destinations**: API Gateway, Application Load Balancer
- **Event Routing**: Route events based on success or failure
- **Workflow Orchestration**: Chain functions together
- **Error Handling**: Handle function failures with destinations

**References:**
- [AWS Lambda@Edge](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html)
- [AWS Lambda Extensions](https://docs.aws.amazon.com/lambda/latest/dg/using-extensions.html)
- [AWS Lambda Destinations](https://docs.aws.amazon.com/lambda/latest/dg/invocation-async.html)

## References

- [AWS Lambda Official Documentation](https://docs.aws.amazon.com/lambda/)
- [AWS Lambda Functions](https://docs.aws.amazon.com/lambda/latest/dg/lambda-functions.html)
- [AWS Lambda Runtimes](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html)
- [AWS Lambda Event Sources](https://docs.aws.amazon.com/lambda/latest/dg/invocation-eventsourcemapping.html)
- [AWS Lambda Performance Optimization](https://docs.aws.amazon.com/lambda/latest/dg/performance-optimization.html)
- [AWS Lambda Security](https://docs.aws.amazon.com/lambda/latest/dg/security.html)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [AWS Lambda Monitoring](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-functions.html)
- [AWS Lambda Pricing](https://aws.amazon.com/lambda/pricing/)
- [AWS Lambda Troubleshooting](https://docs.aws.amazon.com/lambda/latest/dg/troubleshooting-debugging.html)

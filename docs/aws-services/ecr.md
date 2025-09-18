# Amazon Elastic Container Registry (ECR)

## Overview

Amazon Elastic Container Registry (ECR) is a fully managed Docker container registry that makes it easy for developers to store, manage, and deploy Docker container images. ECR is integrated with Amazon Elastic Container Service (ECS), Amazon Elastic Kubernetes Service (EKS), and AWS Lambda, providing a secure, scalable, and reliable way to manage container images.

**Why ECR Matters:**
- **Fully Managed**: No infrastructure to manage, automatic scaling
- **Secure**: Built-in security features and access control
- **Integrated**: Seamless integration with AWS container services
- **Cost-Effective**: Pay only for storage and data transfer
- **High Availability**: Built-in redundancy and fault tolerance
- **Compliance**: Meets various compliance requirements

**ECR Key Concepts:**
- **Repositories**: Containers for storing Docker images
- **Images**: Docker container images stored in repositories
- **Registries**: Regional endpoints for accessing repositories
- **Lifecycle Policies**: Automated image lifecycle management
- **Vulnerability Scanning**: Security scanning for container images

## Key Concepts

### **Repositories**
- **Definition**: A repository is a collection of Docker images in ECR.
- **Purpose**: Repositories organize and store related container images.
- **Types**: Private repositories and public repositories.

**Deep Dive - Repository Types:**

**Private Repositories:**
- **Access Control**: Full control over who can access images
- **Encryption**: Server-side encryption for image data
- **Vulnerability Scanning**: Automatic vulnerability scanning
- **Lifecycle Policies**: Automated image lifecycle management
- **Use Case**: Internal applications, proprietary software

**Public Repositories:**
- **Public Access**: Images are publicly accessible
- **No Authentication**: No AWS credentials required for pull operations
- **Cost**: No charges for data transfer out
- **Use Case**: Open source projects, public container images

**Repository Configuration:**
- **Repository Name**: Unique identifier for the repository
- **Image Tag Mutability**: Mutable or immutable image tags
- **Scanning Configuration**: Vulnerability scanning settings
- **Encryption**: Server-side encryption configuration
- **Lifecycle Policy**: Automated image lifecycle management
- **Access Policy**: Repository access control policies

**Repository Limits:**
- **Repositories**: Unlimited number of repositories per account
- **Images per Repository**: Unlimited number of images
- **Image Size**: Up to 10 GB per image layer
- **Tags per Image**: Unlimited number of tags per image
- **Repository Policy Size**: 20 KB maximum policy size

**References:**
- [AWS ECR Repositories Documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html)
- [AWS ECR Private Repositories](https://docs.aws.amazon.com/AmazonECR/latest/userguide/private-repositories.html)
- [AWS ECR Public Repositories](https://docs.aws.amazon.com/AmazonECR/latest/userguide/public-repositories.html)

### **Images**
- **Definition**: Docker container images stored in ECR repositories.
- **Purpose**: Images contain the application code, dependencies, and runtime environment.
- **Format**: Docker image format with layers and metadata.

**Deep Dive - Image Components:**

**Image Layers:**
- **Base Layer**: Operating system and runtime environment
- **Dependency Layers**: Application dependencies and libraries
- **Application Layer**: Application code and configuration
- **Layer Caching**: Shared layers across multiple images
- **Layer Compression**: Compressed layers for efficient storage

**Image Metadata:**
- **Image Manifest**: JSON document describing image structure
- **Image Configuration**: Runtime configuration and metadata
- **Layer Digests**: Cryptographic hashes for layer integrity
- **Image Tags**: Human-readable identifiers for images
- **Creation Timestamp**: When the image was created

**Image Operations:**
- **Push**: Upload images to ECR repositories
- **Pull**: Download images from ECR repositories
- **Tag**: Create tags for images
- **Untag**: Remove tags from images
- **Delete**: Remove images from repositories
- **List**: List images in repositories

**Image Security:**
- **Encryption**: Server-side encryption for image data
- **Vulnerability Scanning**: Automatic security scanning
- **Access Control**: IAM-based access control
- **Image Signing**: Digital signature verification
- **Compliance**: Meet security and compliance requirements

**References:**
- [AWS ECR Images Documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-images.html)
- [AWS ECR Image Security](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security.html)
- [AWS ECR Image Operations](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)

### **Registries**
- **Definition**: Regional endpoints that provide access to ECR repositories.
- **Purpose**: Registries handle authentication, authorization, and image operations.
- **Regional**: Each AWS region has its own ECR registry.

**Deep Dive - Registry Features:**

**Registry Endpoints:**
- **Regional Endpoints**: Each region has a unique registry endpoint
- **Authentication**: AWS IAM-based authentication
- **Authorization**: Fine-grained access control
- **SSL/TLS**: Encrypted communication
- **High Availability**: Built-in redundancy and fault tolerance

**Registry Operations:**
- **Authentication**: Login to registry using AWS credentials
- **Authorization**: Check permissions for repository access
- **Image Operations**: Push, pull, and manage images
- **Metadata Operations**: Manage image metadata and tags
- **Policy Enforcement**: Enforce repository and lifecycle policies

**Registry Security:**
- **IAM Integration**: Use AWS IAM for access control
- **VPC Endpoints**: Private access from VPC
- **Encryption**: Encrypted data in transit and at rest
- **Audit Logging**: CloudTrail integration for audit logs
- **Compliance**: Meet various compliance requirements

**Registry Limits:**
- **Repositories**: Unlimited repositories per registry
- **Images**: Unlimited images per repository
- **API Calls**: Rate limits for API operations
- **Data Transfer**: Charges for data transfer out
- **Storage**: Charges for image storage

**References:**
- [AWS ECR Registries Documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Registries.html)
- [AWS ECR Registry Endpoints](https://docs.aws.amazon.com/AmazonECR/latest/userguide/registry_auth.html)
- [AWS ECR Registry Security](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security.html)

### **Lifecycle Policies**
- **Definition**: Automated rules for managing image lifecycle in repositories.
- **Purpose**: Automatically clean up old images to reduce storage costs.
- **Configuration**: JSON-based policy configuration.

**Deep Dive - Lifecycle Policy Features:**

**Policy Rules:**
- **Image Count**: Keep only the most recent N images
- **Image Age**: Delete images older than N days
- **Tag Patterns**: Apply rules based on image tags
- **Action Types**: Expire or delete images
- **Rule Priority**: Order of rule execution

**Policy Configuration:**
- **Rule Definition**: Define rules for image management
- **Action Types**: expire (mark for deletion) or delete
- **Selection Criteria**: Image count, age, or tag patterns
- **Rule Priority**: Order of rule execution
- **Policy Validation**: Validate policy syntax and logic

**Policy Examples:**
- **Keep Recent**: Keep only the 10 most recent images
- **Delete Old**: Delete images older than 30 days
- **Tag-Based**: Different rules for different tag patterns
- **Combined Rules**: Multiple rules for complex scenarios

**Policy Benefits:**
- **Cost Optimization**: Reduce storage costs by removing old images
- **Automation**: Automatic cleanup without manual intervention
- **Flexibility**: Customize rules based on your needs
- **Safety**: Prevent accidental deletion of important images

**References:**
- [AWS ECR Lifecycle Policies Documentation](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html)
- [AWS ECR Lifecycle Policy Examples](https://docs.aws.amazon.com/AmazonECR/latest/userguide/lifecycle_policy_examples.html)

## Image Management

### **Image Tagging**
- **Purpose**: Create human-readable identifiers for images
- **Types**: Mutable and immutable tags
- **Best Practices**: Use semantic versioning and meaningful tags

**Image Tagging Deep Dive:**
- **Mutable Tags**: Tags that can be moved to different images
- **Immutable Tags**: Tags that cannot be changed once assigned
- **Tag Strategies**: Semantic versioning, environment tags, build tags
- **Tag Management**: Create, update, and delete tags
- **Tag Policies**: Enforce tag naming conventions

### **Image Scanning**
- **Purpose**: Automatically scan images for vulnerabilities
- **Types**: Basic and enhanced scanning
- **Integration**: Integrate with AWS Security Hub and other security tools

**Image Scanning Deep Dive:**
- **Basic Scanning**: Free vulnerability scanning
- **Enhanced Scanning**: Advanced scanning with additional features
- **Vulnerability Database**: Up-to-date vulnerability information
- **Scan Results**: Detailed vulnerability reports
- **Integration**: Integrate with security tools and workflows

### **Image Signing**
- **Purpose**: Digitally sign images for integrity verification
- **Standards**: Docker Content Trust and Notary
- **Use Case**: Ensure image integrity and authenticity

**Image Signing Deep Dive:**
- **Digital Signatures**: Cryptographic signatures for images
- **Trust Verification**: Verify image authenticity
- **Key Management**: Manage signing keys securely
- **Policy Enforcement**: Enforce signature verification
- **Compliance**: Meet security and compliance requirements

**References:**
- [AWS ECR Image Tagging](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-tag-mutability.html)
- [AWS ECR Image Scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html)
- [AWS ECR Image Signing](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-signing.html)

## Integration with Other AWS Services

### **ECS Integration**
- **Purpose**: Use ECR images in ECS tasks and services
- **Configuration**: ECS task definitions with ECR image references
- **Features**: Automatic image pulling, IAM integration

**ECS Integration Deep Dive:**
- **Task Definitions**: Reference ECR images in task definitions
- **Service Deployment**: Deploy services using ECR images
- **Image Updates**: Update services with new image versions
- **IAM Roles**: Use IAM roles for ECS tasks to access ECR
- **Private Repositories**: Access private repositories from ECS

### **EKS Integration**
- **Purpose**: Use ECR images in EKS pods and deployments
- **Configuration**: Kubernetes manifests with ECR image references
- **Features**: Automatic image pulling, IAM integration

**EKS Integration Deep Dive:**
- **Pod Specifications**: Reference ECR images in pod specs
- **Deployments**: Deploy applications using ECR images
- **Image Updates**: Update deployments with new image versions
- **IAM Roles**: Use IAM roles for service accounts
- **Private Repositories**: Access private repositories from EKS

### **Lambda Integration**
- **Purpose**: Use ECR images for Lambda container functions
- **Configuration**: Lambda function configuration with ECR image references
- **Features**: Container-based Lambda functions, larger deployment packages

**Lambda Integration Deep Dive:**
- **Container Functions**: Use ECR images for Lambda functions
- **Image Size**: Support for larger deployment packages (up to 10 GB)
- **Custom Runtimes**: Use any runtime in container images
- **Image Updates**: Update functions with new image versions
- **IAM Roles**: Use IAM roles for Lambda functions to access ECR

### **CodeBuild Integration**
- **Purpose**: Build and push images to ECR in CI/CD pipelines
- **Configuration**: CodeBuild projects with ECR integration
- **Features**: Automated builds, image pushing, vulnerability scanning

**CodeBuild Integration Deep Dive:**
- **Build Projects**: Configure CodeBuild to build Docker images
- **Image Pushing**: Automatically push images to ECR
- **Build Environment**: Use ECR images as build environments
- **Vulnerability Scanning**: Integrate vulnerability scanning in builds
- **IAM Roles**: Use IAM roles for CodeBuild to access ECR

**References:**
- [AWS ECR ECS Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_ECS.html)
- [AWS ECR EKS Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_EKS.html)
- [AWS ECR Lambda Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_Lambda.html)
- [AWS ECR CodeBuild Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_CodeBuild.html)

## Common Use Cases in Our Project

### **1. Container Image Storage**
- **Purpose**: Store Docker images for the NestJS application
- **Configuration**: Private repository with lifecycle policies
- **Features**: Image versioning, vulnerability scanning, access control

**Detailed Container Image Storage Implementation:**
- **Repository Configuration**: Private repository for NestJS application
- **Image Tagging**: Semantic versioning with git commit hashes
- **Lifecycle Policies**: Keep recent images, delete old ones
- **Vulnerability Scanning**: Automatic security scanning
- **Access Control**: IAM-based access control for CI/CD

### **2. CI/CD Integration**
- **Purpose**: Integrate ECR with GitHub Actions for automated builds
- **Configuration**: GitHub Actions workflow with ECR authentication
- **Features**: Automated builds, image pushing, deployment

**Detailed CI/CD Integration Implementation:**
- **GitHub Actions**: Automated build and push workflow
- **ECR Authentication**: OIDC-based authentication
- **Image Building**: Multi-stage Docker builds
- **Image Pushing**: Push images with tags
- **Deployment**: Deploy images to Lambda

### **3. Lambda Container Deployment**
- **Purpose**: Deploy NestJS application as container image to Lambda
- **Configuration**: Lambda function with ECR image reference
- **Features**: Container-based Lambda, larger deployment package

**Detailed Lambda Container Deployment Implementation:**
- **Container Image**: Optimized NestJS container image
- **Lambda Configuration**: Container image function configuration
- **Image Updates**: Update Lambda with new image versions
- **Performance**: Optimized for Lambda cold starts
- **Monitoring**: Monitor container function performance

**References:**
- [AWS ECR Container Image Storage](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)
- [AWS ECR CI/CD Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_CodeBuild.html)
- [AWS ECR Lambda Container Deployment](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_Lambda.html)

## Best Practices

### **Repository Management Best Practices**
1. **Naming Conventions**: Use consistent naming for repositories
2. **Access Control**: Implement least privilege access control
3. **Lifecycle Policies**: Use lifecycle policies to manage costs
4. **Tagging Strategy**: Use meaningful and consistent tags
5. **Monitoring**: Monitor repository usage and costs

**Advanced Repository Management Practices:**
- **Repository Organization**: Organize repositories by team or project
- **Access Policies**: Use resource-based policies for fine-grained control
- **Cross-Account Access**: Share repositories across AWS accounts
- **Repository Replication**: Replicate repositories across regions
- **Cost Optimization**: Optimize storage costs with lifecycle policies

### **Image Management Best Practices**
1. **Image Optimization**: Optimize images for size and performance
2. **Security Scanning**: Enable vulnerability scanning
3. **Image Signing**: Sign images for integrity verification
4. **Version Control**: Use semantic versioning for tags
5. **Documentation**: Document image contents and usage

**Advanced Image Management Practices:**
- **Multi-Stage Builds**: Use multi-stage builds for smaller images
- **Base Image Selection**: Choose appropriate base images
- **Layer Optimization**: Optimize image layers for caching
- **Security Hardening**: Implement security best practices
- **Compliance**: Meet security and compliance requirements

### **Security Best Practices**
1. **Access Control**: Use IAM roles and policies
2. **Encryption**: Enable encryption for image data
3. **Vulnerability Scanning**: Enable automatic vulnerability scanning
4. **Image Signing**: Sign images for integrity verification
5. **Audit Logging**: Enable CloudTrail for audit logs

**Advanced Security Practices:**
- **Private Repositories**: Use private repositories for sensitive images
- **VPC Endpoints**: Use VPC endpoints for private access
- **Cross-Account Policies**: Implement cross-account access policies
- **Compliance**: Meet security and compliance requirements
- **Security Monitoring**: Monitor security events and vulnerabilities

**References:**
- [AWS ECR Best Practices](https://docs.aws.amazon.com/AmazonECR/latest/userguide/best-practices.html)
- [AWS ECR Security Best Practices](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security.html)
- [AWS ECR Cost Optimization](https://docs.aws.amazon.com/AmazonECR/latest/userguide/cost-optimization.html)

## Monitoring and Debugging

### **CloudWatch Integration**
- **Metrics**: Monitor repository metrics and performance
- **Logs**: View ECR access logs and errors
- **Alarms**: Set up alarms for important metrics
- **Dashboards**: Create monitoring dashboards

**CloudWatch Deep Dive:**
- **Repository Metrics**: Image push/pull counts, repository size
- **Custom Metrics**: Publish custom metrics from applications
- **Log Groups**: Access logs for ECR operations
- **Alarms**: Set up alarms for threshold breaches
- **Dashboards**: Create comprehensive monitoring dashboards

### **CloudTrail Integration**
- **Audit Logging**: Log all ECR API calls and events
- **Access Tracking**: Track who accessed repositories and images
- **Compliance**: Meet compliance requirements with audit logs
- **Security**: Monitor for suspicious activity

**CloudTrail Deep Dive:**
- **API Calls**: Log all ECR API calls and responses
- **Access Events**: Track repository and image access
- **Administrative Events**: Log administrative actions
- **Security Events**: Track security-related events
- **Compliance**: Meet compliance requirements

### **Debugging Tools**
- **CloudWatch Logs**: View and search ECR access logs
- **CloudTrail**: Trace ECR operations and access
- **ECR Console**: Monitor repositories and images in console
- **AWS CLI**: Debug using AWS CLI commands

**Debugging Deep Dive:**
- **Log Analysis**: Analyze ECR access logs for issues
- **Trace Analysis**: Use CloudTrail for debugging
- **Image Analysis**: Analyze image contents and metadata
- **Performance Profiling**: Profile image operations
- **Error Analysis**: Analyze operation errors and failures

**References:**
- [AWS ECR Monitoring](https://docs.aws.amazon.com/AmazonECR/latest/userguide/monitoring.html)
- [AWS ECR CloudWatch Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/monitoring-cloudwatch.html)
- [AWS ECR CloudTrail Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/logging-using-cloudtrail.html)
- [AWS ECR Debugging](https://docs.aws.amazon.com/AmazonECR/latest/userguide/troubleshooting.html)

## Cost Optimization

### **Pricing Model**
- **Storage**: Pay for image storage in repositories
- **Data Transfer**: Pay for data transfer out of AWS
- **API Calls**: Pay for API operations
- **Scanning**: Pay for vulnerability scanning (enhanced scanning)

**Pricing Deep Dive:**
- **Storage**: $0.10 per GB per month for image storage
- **Data Transfer**: $0.09 per GB for first 10 TB
- **API Calls**: $0.10 per 1,000 API calls
- **Enhanced Scanning**: $0.10 per image scan
- **Free Tier**: 500 MB storage and 1,000 API calls per month

### **Cost Optimization Strategies**
1. **Lifecycle Policies**: Use lifecycle policies to delete old images
2. **Image Optimization**: Optimize images for smaller size
3. **Repository Management**: Manage repositories efficiently
4. **Data Transfer**: Minimize data transfer costs
5. **Monitoring**: Monitor costs and usage patterns

**Advanced Cost Optimization:**
- **Storage Optimization**: Use lifecycle policies to manage storage
- **Image Optimization**: Optimize images for size and performance
- **Repository Optimization**: Organize repositories efficiently
- **Data Transfer Optimization**: Minimize data transfer costs
- **Cost Monitoring**: Monitor costs and usage patterns
- **Cost Alerts**: Set up cost alerts and budgets

**References:**
- [AWS ECR Pricing](https://aws.amazon.com/ecr/pricing/)
- [AWS ECR Cost Optimization](https://docs.aws.amazon.com/AmazonECR/latest/userguide/cost-optimization.html)

## Advanced Topics

### **Cross-Account Access**
- **Purpose**: Share repositories across AWS accounts
- **Configuration**: Cross-account IAM policies and resource-based policies
- **Use Cases**: Multi-account organizations, shared services

**Cross-Account Access Deep Dive:**
- **Resource-Based Policies**: Attach policies to repositories
- **Cross-Account IAM**: Use cross-account IAM roles
- **Access Control**: Fine-grained access control across accounts
- **Audit Logging**: Track cross-account access
- **Security**: Implement security best practices

### **Repository Replication**
- **Purpose**: Replicate repositories across AWS regions
- **Configuration**: Cross-region replication settings
- **Use Cases**: Disaster recovery, global distribution

**Repository Replication Deep Dive:**
- **Cross-Region Replication**: Replicate repositories across regions
- **Replication Rules**: Configure replication rules
- **Data Consistency**: Ensure data consistency across regions
- **Cost Management**: Manage replication costs
- **Performance**: Optimize replication performance

### **ECR Public Gallery**
- **Purpose**: Discover and use public container images
- **Features**: Curated public images, community contributions
- **Use Cases**: Quick starts, reference implementations

**ECR Public Gallery Deep Dive:**
- **Public Images**: Discover public container images
- **Community Contributions**: Community-contributed images
- **Quick Starts**: Pre-built images for common use cases
- **Reference Implementations**: Reference implementations
- **Security**: Security scanning for public images

**References:**
- [AWS ECR Cross-Account Access](https://docs.aws.amazon.com/AmazonECR/latest/userguide/repository-policy-examples.html)
- [AWS ECR Repository Replication](https://docs.aws.amazon.com/AmazonECR/latest/userguide/replication.html)
- [AWS ECR Public Gallery](https://gallery.ecr.aws/)

## References

- [AWS ECR Official Documentation](https://docs.aws.amazon.com/ecr/)
- [AWS ECR Repositories](https://docs.aws.amazon.com/AmazonECR/latest/userguide/Repositories.html)
- [AWS ECR Images](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-images.html)
- [AWS ECR Lifecycle Policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/LifecyclePolicies.html)
- [AWS ECR Security](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security.html)
- [AWS ECR Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_ECS.html)
- [AWS ECR Best Practices](https://docs.aws.amazon.com/AmazonECR/latest/userguide/best-practices.html)
- [AWS ECR Monitoring](https://docs.aws.amazon.com/AmazonECR/latest/userguide/monitoring.html)
- [AWS ECR Pricing](https://aws.amazon.com/ecr/pricing/)
- [AWS ECR Troubleshooting](https://docs.aws.amazon.com/AmazonECR/latest/userguide/troubleshooting.html)

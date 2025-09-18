# AWS Identity and Access Management (IAM)

## Overview

AWS Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources. With IAM, you can centrally manage permissions that control which AWS resources users and applications can access.

**Why IAM Matters:**
- **Security**: Prevents unauthorized access to your AWS resources
- **Compliance**: Helps meet regulatory requirements for access control
- **Cost Control**: Prevents accidental resource creation or deletion
- **Auditability**: Provides detailed logs of who did what and when
- **Scalability**: Manages access for thousands of users and resources

**IAM is Global**: IAM is a global service, meaning it's not tied to any specific AWS region. However, the resources that IAM controls access to are region-specific.

## Key Concepts

### **Users**
- **Definition**: An IAM user is an entity that you create in AWS to represent the person or application that uses it to interact with AWS.
- **Purpose**: Users are typically created for people who need access to your AWS account, or for applications that need to access AWS services.
- **Credentials**: Users can have programmatic access (access keys) and/or AWS Management Console access (password).

**Deep Dive - User Types:**
1. **Human Users**: People who need to access the AWS Management Console or use AWS CLI/SDK
2. **Application Users**: Applications that need programmatic access to AWS services
3. **Service Users**: Special users for specific AWS services or integrations

**User Properties:**
- **Unique Name**: Each user has a unique name within your AWS account
- **ARN**: Amazon Resource Name (e.g., `arn:aws:iam::123456789012:user/john.doe`)
- **Path**: Organizational structure (e.g., `/developers/` or `/admins/`)
- **Tags**: Key-value pairs for organization and billing
- **Permissions**: Inherited from groups or attached directly

**Credential Types:**
1. **Console Password**: For AWS Management Console access
2. **Access Keys**: For programmatic access (Access Key ID + Secret Access Key)
3. **SSH Keys**: For CodeCommit access
4. **X.509 Certificates**: For SOAP-based requests (legacy)

**Security Considerations:**
- **Access Key Rotation**: Rotate access keys every 90 days
- **Password Policies**: Enforce strong passwords and expiration
- **MFA**: Require multi-factor authentication for sensitive operations
- **Last Used**: Monitor when access keys were last used

**Advanced User Management:**
- **User Paths**: Organize users hierarchically (e.g., `/developers/`, `/admins/`, `/contractors/`)
- **User Tags**: Add metadata for billing, compliance, and organization
- **User Permissions**: Can have inline policies, managed policies, or group membership
- **User Limits**: Maximum 5,000 users per AWS account
- **User Deletion**: Can be deleted but credentials must be removed first

**Credential Management:**
- **Access Key Lifecycle**: Create → Use → Rotate → Delete
- **Secret Access Key**: Never share, store securely, rotate regularly
- **Console Password**: Can be set by user or administrator
- **Password Reset**: Users can reset their own passwords if allowed
- **Credential Reports**: Download CSV reports of user credentials and usage

**User Federation:**
- **SAML 2.0**: Single sign-on with corporate identity providers
- **OIDC**: OpenID Connect for web and mobile applications
- **Active Directory**: Integration with Microsoft Active Directory
- **External Identity Providers**: Google, Facebook, Amazon, etc.

**References:**
- [AWS IAM Users Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
- [AWS IAM Best Practices for Users](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#users)
- [AWS IAM Credential Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials.html)
- [AWS IAM User Federation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html)

### **Groups**
- **Definition**: An IAM group is a collection of IAM users.
- **Purpose**: Groups let you specify permissions for multiple users, which can make it easier to manage the permissions for those users.
- **Best Practice**: Use groups to assign permissions to users rather than assigning permissions to users individually.

**Deep Dive - Group Management:**
- **Hierarchical Structure**: Groups can be organized in paths (e.g., `/developers/frontend/`, `/developers/backend/`)
- **Nested Groups**: While groups can't contain other groups, you can use paths to create logical hierarchies
- **Dynamic Membership**: Users can be added/removed from groups without changing their individual permissions
- **Policy Inheritance**: Users inherit all policies attached to groups they belong to
- **Cross-Account Groups**: Groups are account-specific and cannot span multiple AWS accounts

**Group Benefits:**
1. **Simplified Management**: Change permissions for multiple users at once
2. **Consistency**: Ensure all users in a group have the same permissions
3. **Auditability**: Easier to track who has what permissions
4. **Compliance**: Meet regulatory requirements for access control

**Common Group Patterns:**
- **Role-Based**: `Developers`, `Admins`, `ReadOnly`
- **Project-Based**: `ProjectAlpha`, `ProjectBeta`
- **Environment-Based**: `Production`, `Staging`, `Development`
- **Department-Based**: `Engineering`, `Marketing`, `Finance`

**Advanced Group Management:**
- **Group Limits**: Maximum 300 groups per AWS account
- **User Limits**: Maximum 10 users per group
- **Policy Limits**: Maximum 10 managed policies per group
- **Inline Policy Limits**: Maximum 2,048 characters per inline policy
- **Group Deletion**: Can be deleted if no users are members

**Group Policy Inheritance:**
- **Cumulative Permissions**: Users get permissions from all groups they belong to
- **Policy Conflicts**: Deny statements override Allow statements
- **Policy Evaluation**: All applicable policies are evaluated together
- **Performance**: More groups can slow down permission evaluation

**Group Best Practices:**
- **Naming Conventions**: Use consistent naming (e.g., `Dev-ReadOnly`, `Prod-Admin`)
- **Documentation**: Document the purpose and permissions of each group
- **Regular Audits**: Review group membership and permissions regularly
- **Least Privilege**: Only grant necessary permissions to groups

**References:**
- [AWS IAM Groups Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_groups.html)
- [AWS IAM Groups Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#groups)
- [AWS IAM Policy Evaluation Logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)

### **Roles**
- **Definition**: An IAM role is an IAM identity that you can create in your account that has specific permissions.
- **Purpose**: Roles are similar to users, but instead of being uniquely associated with one person, roles are intended to be assumable by anyone who needs it.
- **Use Cases**: 
  - Cross-account access
  - Service-to-service access (e.g., Lambda function accessing DynamoDB)
  - Temporary access for users

**Deep Dive - Role Types:**
1. **Service Roles**: Assumed by AWS services (e.g., Lambda execution role)
2. **Cross-Account Roles**: Assumed by users/services in other AWS accounts
3. **Identity Provider Roles**: Assumed by users authenticated through external identity providers
4. **Instance Roles**: Assumed by EC2 instances
5. **Federated Roles**: Assumed by users authenticated through SAML or OIDC

**Role Properties:**
- **Trust Policy**: Defines who can assume the role (Principal)
- **Permissions Policy**: Defines what the role can do (Actions and Resources)
- **Session Duration**: How long the temporary credentials are valid (1-12 hours)
- **External ID**: Additional security for cross-account access
- **MFA Requirements**: Can require MFA to assume the role

**Temporary Credentials:**
- **Access Key ID**: Temporary access key
- **Secret Access Key**: Temporary secret key
- **Session Token**: Security token for the session
- **Expiration**: Credentials expire after the session duration

**Role Assumption Process:**
1. **Request**: Entity requests to assume the role
2. **Validation**: AWS validates the trust policy
3. **Authentication**: Additional authentication if required (MFA, external ID)
4. **Credential Generation**: AWS generates temporary credentials
5. **Access**: Entity uses temporary credentials to access AWS resources

**Advanced Role Features:**
- **Role Chaining**: Roles can assume other roles (with proper trust policies)
- **Cross-Account Access**: Roles can be assumed by entities in other AWS accounts
- **External ID**: Additional security parameter for cross-account access
- **MFA Requirements**: Can require MFA to assume the role
- **Session Duration**: Configurable from 1 hour to 12 hours (maximum)

**Role Types Deep Dive:**
1. **Service Roles**:
   - **Lambda Execution Role**: Allows Lambda functions to access AWS services
   - **EC2 Instance Role**: Allows EC2 instances to access AWS services
   - **ECS Task Role**: Allows ECS tasks to access AWS services
   - **CodeBuild Role**: Allows CodeBuild to access AWS services

2. **Cross-Account Roles**:
   - **Trust Policy**: Specifies which external accounts can assume the role
   - **External ID**: Optional additional security parameter
   - **Session Duration**: How long the temporary credentials are valid
   - **MFA**: Can require MFA for additional security

3. **Identity Provider Roles**:
   - **SAML Roles**: For SAML-based single sign-on
   - **OIDC Roles**: For OpenID Connect authentication
   - **Web Identity Roles**: For web and mobile applications
   - **Cognito Roles**: For Amazon Cognito user pools

**Role Security Considerations:**
- **Trust Policy**: Carefully define who can assume the role
- **External ID**: Use for additional security in cross-account scenarios
- **MFA**: Require MFA for sensitive roles
- **Session Duration**: Use appropriate session duration for the use case
- **Regular Audits**: Review role usage and permissions regularly

**References:**
- [AWS IAM Roles Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [AWS IAM Role Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#roles)
- [AWS IAM Cross-Account Access](https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html)
- [AWS IAM Service Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios.html)

### **Policies**
- **Definition**: A policy is a document that acts as a container for one or more permissions.
- **Types**:
  - **Identity-based policies**: Attached to users, groups, or roles
  - **Resource-based policies**: Attached to resources (like S3 buckets)
  - **Permission boundaries**: Advanced feature for limiting maximum permissions
  - **Organizations SCPs**: Control permissions across multiple AWS accounts

**Deep Dive - Policy Types:**

**1. Identity-Based Policies:**
- **Managed Policies**: Created and managed by AWS or by you
  - **AWS Managed Policies**: Pre-built policies maintained by AWS
  - **Customer Managed Policies**: Custom policies you create and manage
- **Inline Policies**: Embedded directly in users, groups, or roles
- **Attached to**: Users, groups, or roles
- **Scope**: Can grant permissions to any AWS resource

**2. Resource-Based Policies:**
- **Attached to**: Resources (S3 buckets, SNS topics, SQS queues, etc.)
- **Principal**: Specifies who can access the resource
- **Cross-Account Access**: Can grant access to users/roles in other AWS accounts
- **Examples**: S3 bucket policies, SNS topic policies, SQS queue policies

**3. Permission Boundaries:**
- **Purpose**: Set the maximum permissions that an identity-based policy can grant
- **Use Case**: Prevent privilege escalation, especially for users who can create policies
- **Scope**: Applied to users and roles
- **Effect**: Denies any action not explicitly allowed in the boundary

**4. Organizations SCPs (Service Control Policies):**
- **Purpose**: Control permissions across multiple AWS accounts in an organization
- **Scope**: Applied to accounts, organizational units, or the root
- **Effect**: Can only deny permissions, not grant them
- **Use Case**: Prevent certain actions across all accounts in an organization

**Policy Evaluation Logic:**
1. **Default Deny**: All requests are denied by default
2. **Explicit Allow**: Policies can explicitly allow actions
3. **Explicit Deny**: Policies can explicitly deny actions (overrides allows)
4. **Permission Boundaries**: Limit the maximum permissions
5. **Resource-Based Policies**: Additional layer of access control

**Policy Inheritance:**
- **Users**: Inherit policies from groups they belong to
- **Groups**: Can have multiple policies attached
- **Roles**: Can have multiple policies attached
- **Cumulative Effect**: All applicable policies are evaluated together

**Advanced Policy Features:**
- **Policy Variables**: Use variables like `${aws:username}` in policies
- **Policy Conditions**: Fine-grained control over when policies apply
- **Policy Simulation**: Test policies before applying them
- **Policy Validation**: JSON syntax validation and policy structure checks
- **Policy Versioning**: Track changes to managed policies

**Policy Limits and Quotas:**
- **Managed Policies**: Maximum 6,144 characters per policy
- **Inline Policies**: Maximum 2,048 characters per policy
- **Policy Attachments**: Maximum 10 managed policies per user/group/role
- **Inline Policies**: Maximum 1 inline policy per user/group/role
- **Policy Versions**: Maximum 5 versions per managed policy

**Policy Evaluation Deep Dive:**
1. **Request Context**: User, action, resource, conditions
2. **Policy Collection**: Gather all applicable policies
3. **Evaluation Order**: 
   - Permission boundaries (if applicable)
   - Resource-based policies
   - Identity-based policies
4. **Decision Logic**: Allow if any policy allows, deny if any policy denies
5. **Final Decision**: Allow or deny the request

**Policy Best Practices:**
- **Least Privilege**: Grant minimum necessary permissions
- **Use Managed Policies**: Prefer managed policies over inline policies
- **Test Policies**: Use policy simulator before applying
- **Document Policies**: Add descriptions to explain policy purpose
- **Regular Reviews**: Audit policies regularly for unused permissions

**References:**
- [AWS IAM Policies Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
- [AWS IAM Policy Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#policies)
- [AWS IAM Policy Evaluation Logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html)
- [AWS IAM Policy Simulator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)

## Policy Structure

IAM policies are JSON documents that follow this structure:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-bucket/*"
    }
  ]
}
```

### **Key Elements**:

**Version:**
- **Purpose**: Specifies the policy language version
- **Value**: Always use "2012-10-17" (latest version)
- **Backward Compatibility**: Older versions are supported but not recommended
- **Features**: Newer versions include additional features and improvements

**Statement:**
- **Purpose**: Array of individual permission statements
- **Multiple Statements**: Can have multiple statements in a single policy
- **Evaluation**: Each statement is evaluated independently
- **Combined Effect**: All statements are combined to determine final access

**Effect:**
- **Allow**: Grants permission to perform the specified action
- **Deny**: Explicitly denies permission (overrides any Allow statements)
- **Default**: If no Effect is specified, the statement has no effect
- **Precedence**: Deny always takes precedence over Allow

**Action:**
- **Purpose**: Specifies the AWS API action(s) to allow or deny
- **Format**: `service:action` (e.g., `s3:GetObject`, `dynamodb:PutItem`)
- **Wildcards**: Can use `*` to match multiple actions
- **Multiple Actions**: Can specify multiple actions in an array
- **Examples**:
  - `"Action": "s3:GetObject"` - Single action
  - `"Action": ["s3:GetObject", "s3:PutObject"]` - Multiple actions
  - `"Action": "s3:*"` - All S3 actions
  - `"Action": "*"` - All actions (use with caution)

**Resource:**
- **Purpose**: Specifies the AWS resource(s) the statement applies to
- **Format**: Amazon Resource Name (ARN)
- **Wildcards**: Can use `*` to match multiple resources
- **Multiple Resources**: Can specify multiple resources in an array
- **Examples**:
  - `"Resource": "arn:aws:s3:::my-bucket"` - Specific bucket
  - `"Resource": "arn:aws:s3:::my-bucket/*"` - All objects in bucket
  - `"Resource": "*"` - All resources (use with caution)

**Principal:**
- **Purpose**: (For resource-based policies) Specifies who the statement applies to
- **Types**: AWS accounts, IAM users, IAM roles, services, federated users
- **Format**: Varies by principal type
- **Examples**:
  - `"Principal": {"AWS": "arn:aws:iam::123456789012:user/john.doe"}`
  - `"Principal": {"AWS": "arn:aws:iam::123456789012:root"}`
  - `"Principal": {"Service": "lambda.amazonaws.com"}`
  - `"Principal": "*"` - Anyone (use with caution)

**Condition:**
- **Purpose**: Specifies when the statement is in effect
- **Types**: String, Numeric, Date, Boolean, IP address, ARN conditions
- **Operators**: Equals, NotEquals, Like, NotLike, etc.
- **Examples**:
  - `"Condition": {"StringEquals": {"aws:RequestedRegion": "us-east-1"}}`
  - `"Condition": {"IpAddress": {"aws:SourceIp": "203.0.113.0/24"}}`
  - `"Condition": {"DateGreaterThan": {"aws:CurrentTime": "2023-01-01T00:00:00Z"}}`

**Advanced Policy Elements:**

**Sid (Statement ID):**
- **Purpose**: Optional identifier for the statement
- **Format**: String value
- **Use Case**: Helpful for documentation and policy management
- **Example**: `"Sid": "AllowS3GetObject"`

**NotAction:**
- **Purpose**: Specifies actions that are NOT allowed
- **Use Case**: Deny specific actions while allowing others
- **Example**: `"NotAction": "s3:DeleteObject"`

**NotResource:**
- **Purpose**: Specifies resources that are NOT affected
- **Use Case**: Exclude specific resources from the policy
- **Example**: `"NotResource": "arn:aws:s3:::sensitive-bucket/*"`

**Policy Variables:**
- **aws:username**: Current user's username
- **aws:userid**: Current user's unique ID
- **aws:SourceIp**: Source IP address of the request
- **aws:RequestedRegion**: AWS region where the request is made
- **aws:CurrentTime**: Current date and time
- **aws:TokenIssueTime**: When the temporary credentials were issued

**Condition Operators:**
- **String**: StringEquals, StringNotEquals, StringLike, StringNotLike
- **Numeric**: NumericEquals, NumericNotEquals, NumericLessThan, NumericGreaterThan
- **Date**: DateEquals, DateNotEquals, DateLessThan, DateGreaterThan
- **Boolean**: Bool
- **IP Address**: IpAddress, NotIpAddress
- **ARN**: ArnEquals, ArnNotEquals, ArnLike, ArnNotLike

**References:**
- [AWS IAM Policy Elements Reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html)
- [AWS IAM Policy Variables](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_variables.html)
- [AWS IAM Condition Operators](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html)
- [AWS IAM Policy Examples](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html)

## Best Practices

### **Security Best Practices**
1. **Use least privilege**: Grant only the permissions required to perform a task
2. **Use IAM roles instead of long-term credentials**: Roles provide temporary credentials
3. **Enable MFA**: Require multi-factor authentication for sensitive operations
4. **Regular access reviews**: Periodically review and remove unnecessary permissions
5. **Use IAM Access Analyzer**: Identify resources that are shared with external entities

**Advanced Security Practices:**
- **Permission Boundaries**: Use permission boundaries to limit maximum permissions for users who can create policies
- **Cross-Account Access**: Use roles for cross-account access instead of sharing credentials
- **External ID**: Use external ID for additional security in cross-account scenarios
- **Session Duration**: Set appropriate session duration for temporary credentials (1-12 hours)
- **IP Restrictions**: Use conditions to restrict access by IP address or CIDR block
- **Time-Based Access**: Use conditions to restrict access by time of day or date range
- **Resource Tagging**: Use resource tags for fine-grained access control
- **Service-Linked Roles**: Use service-linked roles for AWS services when available
- **Credential Rotation**: Implement automated credential rotation for long-term access keys

### **Operational Best Practices**
1. **Use groups**: Assign permissions to groups rather than individual users
2. **Use managed policies**: Prefer AWS managed policies over custom policies when possible
3. **Use policy conditions**: Add conditions to policies for additional security
4. **Monitor activity**: Use CloudTrail to monitor IAM activity
5. **Rotate credentials**: Regularly rotate access keys and passwords

**Advanced Operational Practices:**
- **Policy Simulation**: Test policies before applying them using the IAM Policy Simulator
- **Automated Auditing**: Use AWS Config and CloudTrail for automated compliance monitoring
- **Policy Versioning**: Track changes to managed policies and maintain version history
- **Naming Conventions**: Use consistent naming for users, groups, roles, and policies
- **Path Organization**: Use paths to organize IAM resources hierarchically
- **Regular Reviews**: Schedule regular reviews of IAM permissions and access patterns
- **Documentation**: Document the purpose and scope of custom policies
- **Testing**: Test IAM changes in development environments before production
- **Backup**: Maintain backups of critical IAM configurations

**References:**
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS IAM Security Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#security)
- [AWS IAM Operational Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#operational)
- [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html)
- [AWS IAM Policy Simulator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)

## Common Use Cases in Our Project

### **1. Service Roles**
- **Lambda Execution Role**: Allows Lambda functions to access other AWS services
- **ECR Access Role**: Allows GitHub Actions to push Docker images to ECR
- **API Gateway Role**: Allows API Gateway to invoke Lambda functions

**Detailed Service Role Examples:**
- **SmartWishlistApiLambdaRole**: 
  - Permissions: DynamoDB read/write, SQS send messages, Cognito token verification
  - Trust Policy: `lambda.amazonaws.com` service principal
  - Environment Variables: Table names, queue URLs, user pool IDs

- **GitHubAction-SmartWishlist-DeployRole**:
  - Permissions: ECR push/pull, CDK deploy, CloudFormation stack management
  - Trust Policy: OIDC provider for GitHub Actions
  - External ID: Additional security for cross-account access

### **2. Cross-Service Access**
- **Lambda → DynamoDB**: Lambda function needs permission to read/write to DynamoDB table
- **Lambda → SQS**: Lambda function needs permission to receive messages from SQS queue
- **Lambda → Cognito**: Lambda function needs permission to verify JWT tokens

**Detailed Cross-Service Permissions:**
- **DynamoDB Access**:
  - Actions: `dynamodb:GetItem`, `dynamodb:PutItem`, `dynamodb:UpdateItem`, `dynamodb:DeleteItem`
  - Resources: Specific table ARNs or table ARN patterns
  - Conditions: Optional IP or time-based restrictions

- **SQS Access**:
  - Actions: `sqs:SendMessage`, `sqs:ReceiveMessage`, `sqs:DeleteMessage`
  - Resources: Specific queue ARNs
  - Conditions: Optional message size or delay restrictions

- **Cognito Access**:
  - Actions: `cognito-idp:GetUser`, `cognito-idp:AdminGetUser`
  - Resources: User pool ARNs
  - Conditions: Optional user attribute restrictions

### **3. CI/CD Integration**
- **GitHub Actions OIDC**: Uses IAM roles with OIDC trust policy for secure, passwordless access
- **Deployment Permissions**: Role that can deploy CDK stacks and manage resources

**Detailed CI/CD IAM Setup:**
- **OIDC Provider**: 
  - URL: `https://token.actions.githubusercontent.com`
  - Audience: `sts.amazonaws.com`
  - Thumbprint: GitHub's OIDC certificate thumbprint

- **Trust Policy for GitHub Actions**:
  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Federated": "arn:aws:iam::ACCOUNT:oidc-provider/token.actions.githubusercontent.com"
        },
        "Action": "sts:AssumeRoleWithWebIdentity",
        "Condition": {
          "StringEquals": {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
          },
          "StringLike": {
            "token.actions.githubusercontent.com:sub": "repo:USERNAME/REPO:*"
          }
        }
      }
    ]
  }
  ```

**References:**
- [AWS IAM Service Roles](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_common-scenarios.html)
- [AWS IAM Cross-Service Access](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_examples_aws_my-sec-creds-self-manage.html)
- [AWS IAM OIDC Integration](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [GitHub Actions OIDC with AWS](https://docs.github.com/en/actions/deployment/security/hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

## Trust Policies

Trust policies define which principals can assume a role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

**Trust Policy Deep Dive:**

**Principal Types:**
- **AWS Account**: `"Principal": {"AWS": "arn:aws:iam::123456789012:root"}`
- **IAM User**: `"Principal": {"AWS": "arn:aws:iam::123456789012:user/john.doe"}`
- **IAM Role**: `"Principal": {"AWS": "arn:aws:iam::123456789012:role/MyRole"}`
- **AWS Service**: `"Principal": {"Service": "lambda.amazonaws.com"}`
- **Federated User**: `"Principal": {"Federated": "arn:aws:iam::123456789012:saml-provider/MyProvider"}`
- **External ID**: `"Principal": {"AWS": "arn:aws:iam::123456789012:root", "ExternalId": "unique-id"}`

**Trust Policy Conditions:**
- **External ID**: Additional security for cross-account access
- **MFA**: Require multi-factor authentication
- **IP Address**: Restrict by source IP
- **Time**: Restrict by time of day or date range
- **User Agent**: Restrict by user agent string

**Common Trust Policy Patterns:**
1. **Service Role**: Allow AWS service to assume role
2. **Cross-Account Role**: Allow external account to assume role
3. **Federated Role**: Allow external identity provider to assume role
4. **Instance Role**: Allow EC2 instance to assume role

**References:**
- [AWS IAM Trust Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html)
- [AWS IAM Cross-Account Access](https://docs.aws.amazon.com/IAM/latest/UserGuide/tutorial_cross-account-with-roles.html)
- [AWS IAM External ID](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_create_for-user_externalid.html)

## Policy Conditions

Conditions add additional security by specifying when a policy is in effect:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::example-bucket/*",
      "Condition": {
        "StringEquals": {
          "aws:RequestedRegion": "us-east-1"
        }
      }
    }
  ]
}
```

**Policy Conditions Deep Dive:**

**Common Condition Keys:**
- **aws:SourceIp**: Source IP address of the request
- **aws:RequestedRegion**: AWS region where the request is made
- **aws:CurrentTime**: Current date and time
- **aws:TokenIssueTime**: When the temporary credentials were issued
- **aws:userid**: Unique identifier of the user
- **aws:username**: Username of the user
- **aws:PrincipalTag**: Tags attached to the principal
- **aws:ResourceTag**: Tags attached to the resource

**Condition Types:**
1. **String Conditions**:
   - `StringEquals`: Exact string match
   - `StringNotEquals`: Not equal to string
   - `StringLike`: Pattern matching with wildcards
   - `StringNotLike`: Not matching pattern

2. **Numeric Conditions**:
   - `NumericEquals`: Equal to number
   - `NumericNotEquals`: Not equal to number
   - `NumericLessThan`: Less than number
   - `NumericGreaterThan`: Greater than number

3. **Date Conditions**:
   - `DateEquals`: Equal to date
   - `DateNotEquals`: Not equal to date
   - `DateLessThan`: Before date
   - `DateGreaterThan`: After date

4. **Boolean Conditions**:
   - `Bool`: True or false value

5. **IP Address Conditions**:
   - `IpAddress`: IP address in CIDR block
   - `NotIpAddress`: IP address not in CIDR block

**Advanced Condition Examples:**
- **Time-based Access**: Restrict access to business hours
- **IP-based Access**: Restrict access to office network
- **Resource Tagging**: Access based on resource tags
- **User Attributes**: Access based on user attributes
- **Request Context**: Access based on request parameters

**References:**
- [AWS IAM Policy Conditions](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition.html)
- [AWS IAM Condition Keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html)
- [AWS IAM Condition Operators](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_condition_operators.html)

## Monitoring and Auditing

### **CloudTrail Integration**
- IAM actions are logged in CloudTrail
- Monitor who is doing what, when, and from where
- Set up alerts for sensitive IAM actions

**CloudTrail Deep Dive:**
- **Event Types**: Management events, data events, insight events
- **Log Locations**: S3 bucket, CloudWatch Logs, or both
- **Event History**: 90 days of event history in console
- **Log File Format**: JSON format with detailed event information
- **Encryption**: Server-side encryption with KMS keys
- **Log Integrity**: CloudTrail log file integrity validation

**Key IAM Events to Monitor:**
- `CreateUser`, `DeleteUser`, `AttachUserPolicy`, `DetachUserPolicy`
- `CreateRole`, `DeleteRole`, `AssumeRole`, `PassRole`
- `CreatePolicy`, `DeletePolicy`, `AttachRolePolicy`, `DetachRolePolicy`
- `CreateAccessKey`, `DeleteAccessKey`, `UpdateAccessKey`
- `EnableMFADevice`, `DisableMFADevice`

### **Access Analyzer**
- Identifies resources that are shared with external entities
- Helps identify overprivileged resources
- Provides recommendations for policy improvements

**Access Analyzer Deep Dive:**
- **Resource Types**: S3 buckets, IAM roles, KMS keys, Lambda functions, SQS queues
- **Analysis Types**: External access, unused access, public access
- **Findings**: Detailed reports on access patterns and recommendations
- **Automated Analysis**: Continuous monitoring and analysis
- **Policy Generation**: Generate least-privilege policies based on usage

**Access Analyzer Benefits:**
- **Security**: Identify unintended external access
- **Compliance**: Meet regulatory requirements for access control
- **Cost Optimization**: Remove unused permissions
- **Risk Reduction**: Minimize attack surface

### **Additional Monitoring Tools**
- **AWS Config**: Track IAM resource changes and compliance
- **CloudWatch**: Monitor IAM metrics and set up alarms
- **Security Hub**: Centralized security findings and compliance
- **GuardDuty**: Threat detection for IAM-related activities

**References:**
- [AWS CloudTrail Documentation](https://docs.aws.amazon.com/cloudtrail/)
- [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html)
- [AWS Config Documentation](https://docs.aws.amazon.com/config/)
- [AWS Security Hub](https://docs.aws.amazon.com/securityhub/)

## Common IAM Actions

### **User Management**
- `iam:CreateUser`
- `iam:DeleteUser`
- `iam:AttachUserPolicy`
- `iam:DetachUserPolicy`

**User Management Deep Dive:**
- **User Creation**: `iam:CreateUser`, `iam:CreateLoginProfile`, `iam:CreateAccessKey`
- **User Modification**: `iam:UpdateUser`, `iam:UpdateLoginProfile`, `iam:UpdateAccessKey`
- **User Deletion**: `iam:DeleteUser`, `iam:DeleteLoginProfile`, `iam:DeleteAccessKey`
- **User Information**: `iam:GetUser`, `iam:ListUsers`, `iam:GetUserPolicy`
- **User Groups**: `iam:AddUserToGroup`, `iam:RemoveUserFromGroup`, `iam:ListGroupsForUser`

### **Role Management**
- `iam:CreateRole`
- `iam:DeleteRole`
- `iam:AssumeRole`
- `iam:PassRole`

**Role Management Deep Dive:**
- **Role Creation**: `iam:CreateRole`, `iam:AttachRolePolicy`, `iam:PutRolePolicy`
- **Role Modification**: `iam:UpdateRole`, `iam:UpdateAssumeRolePolicy`
- **Role Deletion**: `iam:DeleteRole`, `iam:DetachRolePolicy`, `iam:DeleteRolePolicy`
- **Role Information**: `iam:GetRole`, `iam:ListRoles`, `iam:GetRolePolicy`
- **Role Assumption**: `iam:AssumeRole`, `iam:AssumeRoleWithSAML`, `iam:AssumeRoleWithWebIdentity`

### **Policy Management**
- `iam:CreatePolicy`
- `iam:DeletePolicy`
- `iam:AttachRolePolicy`
- `iam:DetachRolePolicy`

**Policy Management Deep Dive:**
- **Policy Creation**: `iam:CreatePolicy`, `iam:CreatePolicyVersion`
- **Policy Modification**: `iam:UpdatePolicy`, `iam:SetDefaultPolicyVersion`
- **Policy Deletion**: `iam:DeletePolicy`, `iam:DeletePolicyVersion`
- **Policy Information**: `iam:GetPolicy`, `iam:ListPolicies`, `iam:GetPolicyVersion`
- **Policy Attachment**: `iam:AttachUserPolicy`, `iam:AttachGroupPolicy`, `iam:AttachRolePolicy`

**References:**
- [AWS IAM Actions Reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_actions.html)
- [AWS IAM User Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users.html)
- [AWS IAM Role Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html)
- [AWS IAM Policy Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)

## Integration with Other AWS Services

### **Lambda**
- Execution roles provide permissions for Lambda functions
- Service-linked roles for AWS managed services

**Lambda IAM Integration Deep Dive:**
- **Execution Role**: Provides permissions for Lambda function to access AWS services
- **Service-Linked Roles**: Automatically created for AWS managed services
- **Resource-Based Policies**: Control who can invoke Lambda functions
- **Cross-Account Access**: Allow external accounts to invoke Lambda functions
- **VPC Access**: Permissions for Lambda to access VPC resources

### **ECR**
- Repository policies control who can push/pull images
- IAM policies control ECR API access

**ECR IAM Integration Deep Dive:**
- **Repository Policies**: Control who can push/pull images from repositories
- **IAM Policies**: Control ECR API access (CreateRepository, DescribeRepositories, etc.)
- **Cross-Account Access**: Allow external accounts to access repositories
- **Lifecycle Policies**: Control image retention and cleanup
- **Scanning Policies**: Control vulnerability scanning permissions

### **API Gateway**
- Resource policies control API access
- IAM roles for API Gateway to invoke Lambda

**API Gateway IAM Integration Deep Dive:**
- **Resource Policies**: Control who can access API endpoints
- **IAM Roles**: For API Gateway to invoke Lambda functions
- **Cross-Account Access**: Allow external accounts to access APIs
- **Cognito Integration**: Use Cognito for API authentication
- **Custom Authorizers**: Lambda-based custom authorization

### **Cognito**
- IAM roles for Cognito to access other AWS services
- User pool policies for fine-grained access control

**Cognito IAM Integration Deep Dive:**
- **Identity Pool Roles**: IAM roles for authenticated and unauthenticated users
- **User Pool Policies**: Control user pool operations and access
- **Federated Identities**: Integration with external identity providers
- **Cross-Account Access**: Allow external accounts to access user pools
- **Custom Attributes**: Use custom attributes for fine-grained access control

**References:**
- [AWS Lambda IAM Integration](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)
- [AWS ECR IAM Integration](https://docs.aws.amazon.com/AmazonECR/latest/userguide/iam-policies.html)
- [AWS API Gateway IAM Integration](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-iam-policy-examples.html)
- [AWS Cognito IAM Integration](https://docs.aws.amazon.com/cognito/latest/developerguide/iam-roles.html)

## Security Considerations

### **Access Key Management**
- Rotate access keys regularly
- Use temporary credentials when possible
- Monitor access key usage

**Access Key Security Deep Dive:**
- **Rotation Schedule**: Rotate access keys every 90 days or less
- **Automated Rotation**: Use AWS Secrets Manager for automated rotation
- **Usage Monitoring**: Monitor access key usage patterns and locations
- **Inactive Keys**: Remove or disable unused access keys
- **Key Storage**: Store access keys securely (AWS Secrets Manager, environment variables)
- **Key Sharing**: Never share access keys or commit them to version control

### **Password Policies**
- Enforce strong password requirements
- Enable password expiration
- Require password changes on first use

**Password Policy Deep Dive:**
- **Minimum Length**: Require at least 8 characters (recommended 12+)
- **Character Requirements**: Mix of uppercase, lowercase, numbers, symbols
- **Password History**: Prevent reuse of recent passwords
- **Expiration**: Set password expiration (90 days recommended)
- **Account Lockout**: Lock accounts after failed login attempts
- **Password Complexity**: Use AWS managed password policy or custom policy

### **MFA Integration**
- Require MFA for sensitive operations
- Use hardware or virtual MFA devices
- Consider MFA for programmatic access

**MFA Security Deep Dive:**
- **Device Types**: Hardware tokens, virtual MFA apps, SMS, voice calls
- **MFA Policies**: Require MFA for sensitive operations (delete, modify, etc.)
- **Conditional MFA**: Use conditions to require MFA for specific actions
- **Backup Codes**: Provide backup codes for account recovery
- **Device Management**: Track and manage MFA devices
- **Programmatic Access**: Consider MFA for long-term access keys

**Additional Security Measures:**
- **Session Duration**: Limit session duration for temporary credentials
- **IP Restrictions**: Restrict access by IP address or CIDR block
- **Time Restrictions**: Restrict access by time of day or date range
- **Resource Tagging**: Use resource tags for access control
- **Regular Audits**: Conduct regular security audits and access reviews

**References:**
- [AWS IAM Security Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#security)
- [AWS IAM Access Key Management](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html)
- [AWS IAM Password Policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_passwords_account-policy.html)
- [AWS IAM MFA](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa.html)

## Cost Implications

- **IAM is free**: No additional charges for IAM usage
- **Indirect costs**: IAM permissions control access to other AWS services that may incur costs
- **Resource limits**: IAM has limits on users, groups, roles, and policies per account

**Cost Management Deep Dive:**
- **No Direct Costs**: IAM itself is free to use
- **Indirect Costs**: IAM permissions control access to other AWS services that may incur costs
- **Resource Limits**: IAM has limits on users, groups, roles, and policies per account
- **Cost Optimization**: Use IAM to control access and prevent unnecessary resource creation
- **Billing Integration**: IAM integrates with AWS billing for cost allocation and tracking
- **Cost Alerts**: Set up billing alerts to monitor costs related to IAM-controlled resources

**IAM Resource Limits:**
- **Users**: 5,000 users per AWS account
- **Groups**: 300 groups per AWS account
- **Roles**: 1,000 roles per AWS account
- **Policies**: 1,500 managed policies per AWS account
- **Policy Attachments**: 10 managed policies per user/group/role
- **Inline Policies**: 1 inline policy per user/group/role

## Advanced Topics

### **IAM Identity Center (Successor to AWS SSO)**
- **Centralized Access Management**: Manage access across multiple AWS accounts
- **External Identity Providers**: Integration with Active Directory, Okta, etc.
- **Permission Sets**: Reusable sets of permissions for different job functions
- **Multi-Account Access**: Single sign-on across multiple AWS accounts

### **IAM Access Analyzer**
- **External Access Detection**: Identify resources shared with external entities
- **Unused Access Detection**: Find unused permissions and access
- **Policy Generation**: Generate least-privilege policies based on usage
- **Continuous Monitoring**: Ongoing analysis of access patterns

### **IAM Policy Simulator**
- **Policy Testing**: Test policies before applying them
- **Access Simulation**: Simulate access requests to understand policy effects
- **Policy Validation**: Validate policy syntax and structure
- **Access Analysis**: Analyze what access a policy grants

### **IAM Organizations Integration**
- **Service Control Policies**: Control permissions across multiple AWS accounts
- **Cross-Account Access**: Manage access across organization accounts
- **Centralized Management**: Manage IAM resources from a central location
- **Compliance**: Ensure compliance across all organization accounts

**References:**
- [AWS IAM Official Documentation](https://docs.aws.amazon.com/iam/)
- [IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [IAM Policy Reference](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies.html)
- [IAM Troubleshooting Guide](https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshooting.html)
- [AWS IAM Identity Center](https://docs.aws.amazon.com/singlesignon/)
- [AWS IAM Access Analyzer](https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html)
- [AWS IAM Policy Simulator](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_testing-policies.html)
- [AWS Organizations](https://docs.aws.amazon.com/organizations/)

# Testing Auth (Cognito) Features - cURL Commands

This document provides comprehensive cURL commands to test the authentication features implemented with AWS Cognito in the Smart Wishlist application.

## Prerequisites

1. **Deploy the application** with Cognito infrastructure
2. **Get the API Gateway URL** from CDK outputs
3. **Verify Cognito User Pool** is created and configured
4. **Test user credentials** for authentication

## 1. Authentication Setup

### Get API Gateway URL
```bash
# Get the API URL from CDK outputs (run from infrastructure directory)
cd infrastructure
API_URL=$(cdk outputs | grep ApiUrl | cut -d' ' -f2)
echo "API URL: $API_URL"
```

### Check Cognito Configuration
```bash
# Get User Pool ID and Client ID from CDK outputs
USER_POOL_ID=$(cdk outputs | grep UserPoolId | cut -d' ' -f2)
CLIENT_ID=$(cdk outputs | grep UserPoolClientId | cut -d' ' -f2)

echo "User Pool ID: $USER_POOL_ID"
echo "Client ID: $CLIENT_ID"
```

## 2. User Registration (Sign Up)

### Basic User Registration
```bash
# Sign up a new user
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### Registration with Different Email Formats
```bash
# Test with various email formats
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user+test@example.com",
    "password": "TestPassword123!"
  }'

curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@example.com",
    "password": "TestPassword123!"
  }'
```

### Test Password Requirements
```bash
# Test weak password (should fail)
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "weak@example.com",
    "password": "123"
  }'

# Test strong password (should succeed)
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "strong@example.com",
    "password": "StrongPassword123!"
  }'
```

## 3. User Authentication (Sign In)

### Successful Authentication
```bash
# Sign in with valid credentials
curl -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### Extract JWT Token
```bash
# Sign in and extract JWT token
TOKEN=$(curl -s -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }' | jq -r '.accessToken')

echo "JWT Token: $TOKEN"
```

### Test Invalid Credentials
```bash
# Test with wrong password
curl -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword123!"
  }'

# Test with non-existent user
curl -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "TestPassword123!"
  }'
```

## 4. JWT Token Validation

### Test Protected Endpoints
```bash
# Test accessing protected endpoint with valid token
curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer $TOKEN"
```

### Test Invalid Token
```bash
# Test with invalid token
curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer invalid-token"
```

### Test Expired Token
```bash
# Test with expired token (if you have one)
curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer expired-token"
```

### Test Missing Token
```bash
# Test without token
curl -X GET https://your-api-gateway-url/wishlist
```

## 5. User Profile Management

### Get User Profile
```bash
# Get current user profile
curl -X GET https://your-api-gateway-url/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Test Profile Access Without Token
```bash
# Test profile access without authentication
curl -X GET https://your-api-gateway-url/auth/profile
```

## 6. Complete Authentication Flow Test

### Step 1: User Registration
```bash
# Register a new user
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration-test@example.com",
    "password": "IntegrationTest123!"
  }'
```

### Step 2: User Authentication
```bash
# Sign in and get token
TOKEN=$(curl -s -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration-test@example.com",
    "password": "IntegrationTest123!"
  }' | jq -r '.accessToken')

echo "JWT Token: $TOKEN"
```

### Step 3: Access Protected Resources
```bash
# Access user profile
curl -X GET https://your-api-gateway-url/auth/profile \
  -H "Authorization: Bearer $TOKEN"

# Access wishlists (should work with valid token)
curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer $TOKEN"
```

### Step 4: Test Token Persistence
```bash
# Test that the same token works for multiple requests
curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer $TOKEN"

curl -X GET https://your-api-gateway-url/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

## 7. Error Testing

### Test Malformed Requests
```bash
# Test with missing email
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "password": "TestPassword123!"
  }'

# Test with missing password
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Test with invalid email format
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "TestPassword123!"
  }'
```

### Test Duplicate Registration
```bash
# Try to register the same user twice
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "TestPassword123!"
  }'

# Try again with same email
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duplicate@example.com",
    "password": "TestPassword123!"
  }'
```

## 8. Security Testing

### Test JWT Token Structure
```bash
# Decode JWT token to inspect payload
echo $TOKEN | cut -d'.' -f2 | base64 -d | jq
```

### Test Token Header Variations
```bash
# Test different authorization header formats
curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: $TOKEN"

curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer$TOKEN"

curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: BEARER $TOKEN"
```

### Test CORS Headers
```bash
# Test CORS preflight request
curl -X OPTIONS https://your-api-gateway-url/signup \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

## 9. Performance Testing

### Test Multiple Concurrent Logins
```bash
# Test multiple users logging in simultaneously
for i in {1..5}; do
  curl -X POST https://your-api-gateway-url/signin \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"user$i@example.com\",
      \"password\": \"TestPassword123!\"
    }" &
done
wait
```

### Test Token Refresh
```bash
# Test multiple requests with the same token
for i in {1..10}; do
  curl -X GET https://your-api-gateway-url/auth/profile \
    -H "Authorization: Bearer $TOKEN" &
done
wait
```

## 10. Expected Responses

### Successful Sign Up Response
```json
{
  "message": "User registered successfully",
  "user": {
    "email": "test@example.com",
    "sub": "12345678-1234-1234-1234-123456789012"
  }
}
```

### Successful Sign In Response
```json
{
  "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 3600
}
```

### Successful Profile Response
```json
{
  "sub": "12345678-1234-1234-1234-123456789012",
  "email": "test@example.com",
  "email_verified": true
}
```

### Error Response Examples
```json
{
  "statusCode": 400,
  "message": "User already exists",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

```json
{
  "statusCode": 401,
  "message": "Invalid token",
  "error": "Unauthorized"
}
```

## 11. Monitoring and Verification

### Check Cognito User Pool
```bash
# List users in the User Pool
aws cognito-idp list-users --user-pool-id $USER_POOL_ID

# Get user details
aws cognito-idp admin-get-user --user-pool-id $USER_POOL_ID --username test@example.com
```

### Check CloudWatch Logs
```bash
# Check Lambda function logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/SmartWishlistApi"
aws logs get-log-events --log-group-name "/aws/lambda/SmartWishlistApi" --log-stream-name "LATEST"
```

### Check API Gateway Logs
```bash
# Check API Gateway execution logs
aws logs describe-log-groups --log-group-name-prefix "/aws/apigateway"
```

## 12. Troubleshooting

### Common Issues and Solutions

1. **401 Unauthorized**: Check JWT token validity and format
2. **400 Bad Request**: Validate request payload format
3. **403 Forbidden**: Check Cognito User Pool configuration
4. **500 Internal Server Error**: Check Lambda function logs and Cognito configuration

### Debug Commands
```bash
# Check Cognito User Pool configuration
aws cognito-idp describe-user-pool --user-pool-id $USER_POOL_ID

# Check User Pool Client configuration
aws cognito-idp describe-user-pool-client --user-pool-id $USER_POOL_ID --client-id $CLIENT_ID

# Check Lambda function configuration
aws lambda get-function-configuration --function-name SmartWishlistApi
```

This comprehensive testing guide covers all the authentication features implemented with AWS Cognito in your Smart Wishlist application! 🔐

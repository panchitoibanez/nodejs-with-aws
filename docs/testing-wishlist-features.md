# Testing Wishlist Features - cURL Commands

This document provides comprehensive cURL commands to test the wishlist features implemented with DynamoDB, Lambda, and SQS in the Smart Wishlist application.

## Prerequisites

1. **Deploy the application** with DynamoDB, Lambda, and SQS infrastructure
2. **Get the API Gateway URL** from CDK outputs
3. **Authenticate a user** and get JWT token
4. **Verify DynamoDB table** is created and accessible

## 1. Setup and Authentication

### Get API Gateway URL
```bash
# Get the API URL from CDK outputs (run from infrastructure directory)
cd infrastructure
API_URL=$(cdk outputs | grep ApiUrl | cut -d' ' -f2)
echo "API URL: $API_URL"
```

### Authenticate User
```bash
# Sign up a test user
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wishlist-test@example.com",
    "password": "WishlistTest123!"
  }'

# Sign in and get JWT token
TOKEN=$(curl -s -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wishlist-test@example.com",
    "password": "WishlistTest123!"
  }' | jq -r '.accessToken')

echo "JWT Token: $TOKEN"
```

## 2. Wishlist CRUD Operations

### Create Wishlist
```bash
# Create a new wishlist
curl -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "My Tech Wishlist"
  }'
```

### Create Multiple Wishlists
```bash
# Create different types of wishlists
curl -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Birthday Wishlist"
  }'

curl -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Holiday Shopping"
  }'

curl -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Gaming Setup"
  }'
```

### Get All Wishlists
```bash
# Get all wishlists for the authenticated user
curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer $TOKEN"
```

### Extract Wishlist ID
```bash
# Get wishlists and extract the first wishlist ID
WISHLIST_RESPONSE=$(curl -s -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer $TOKEN")

WISHLIST_ID=$(echo $WISHLIST_RESPONSE | jq -r '.[0].SK' | cut -d'#' -f2)
echo "Wishlist ID: $WISHLIST_ID"
```

### Update Wishlist
```bash
# Update wishlist name
curl -X PATCH https://your-api-gateway-url/wishlist/$WISHLIST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Updated Tech Wishlist"
  }'
```

### Delete Wishlist
```bash
# Delete a wishlist
curl -X DELETE https://your-api-gateway-url/wishlist/$WISHLIST_ID \
  -H "Authorization: Bearer $TOKEN"
```

## 3. Wishlist Items Management

### Add Item to Wishlist
```bash
# Add an item to wishlist (triggers SQS message for scraping)
curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B08N5WRWNW"
  }'
```

### Add Multiple Items
```bash
# Add different types of items
curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B08N5WRWNW"
  }'

curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B07FZ8S74R"
  }'

curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B08N5WRWNW"
  }'
```

### Test Different URL Formats
```bash
# Test with various e-commerce URLs
curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B08N5WRWNW"
  }'

curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.bestbuy.com/site/apple-iphone-15/1234567890.p"
  }'

curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.target.com/p/apple-iphone-15/-/A-1234567890"
  }'
```

## 4. Complete Integration Test Flow

### Step 1: Create Test User and Authenticate
```bash
# Create user
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration-test@example.com",
    "password": "IntegrationTest123!"
  }'

# Get token
TOKEN=$(curl -s -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration-test@example.com",
    "password": "IntegrationTest123!"
  }' | jq -r '.accessToken')

echo "JWT Token: $TOKEN"
```

### Step 2: Create Wishlist
```bash
# Create wishlist
WISHLIST_RESPONSE=$(curl -s -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Integration Test Wishlist"
  }')

WISHLIST_ID=$(echo $WISHLIST_RESPONSE | jq -r '.wishlistId')
echo "Wishlist ID: $WISHLIST_ID"
```

### Step 3: Add Items to Wishlist
```bash
# Add multiple items
curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B08N5WRWNW"
  }'

curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B07FZ8S74R"
  }'
```

### Step 4: Verify Wishlist and Items
```bash
# Get all wishlists
curl -X GET https://your-api-gateway-url/wishlist \
  -H "Authorization: Bearer $TOKEN"
```

### Step 5: Update Wishlist
```bash
# Update wishlist name
curl -X PATCH https://your-api-gateway-url/wishlist/$WISHLIST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Updated Integration Test Wishlist"
  }'
```

### Step 6: Clean Up
```bash
# Delete the wishlist
curl -X DELETE https://your-api-gateway-url/wishlist/$WISHLIST_ID \
  -H "Authorization: Bearer $TOKEN"
```

## 5. Error Testing

### Test Invalid Wishlist Operations
```bash
# Test accessing non-existent wishlist
curl -X GET https://your-api-gateway-url/wishlist/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer $TOKEN"

# Test updating non-existent wishlist
curl -X PATCH https://your-api-gateway-url/wishlist/00000000-0000-0000-0000-000000000000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Non-existent Wishlist"
  }'

# Test deleting non-existent wishlist
curl -X DELETE https://your-api-gateway-url/wishlist/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer $TOKEN"
```

### Test Invalid Item Operations
```bash
# Test adding item to non-existent wishlist
curl -X POST https://your-api-gateway-url/wishlist/00000000-0000-0000-0000-000000000000/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B08N5WRWNW"
  }'
```

### Test Invalid URL Formats
```bash
# Test with invalid URLs
curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "not-a-valid-url"
  }'

curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "ftp://invalid-protocol.com"
  }'
```

### Test Unauthorized Access
```bash
# Test without authentication
curl -X GET https://your-api-gateway-url/wishlist

curl -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Unauthorized Wishlist"
  }'
```

## 6. SQS Integration Testing

### Monitor SQS Queue
```bash
# Check SQS queue for messages
aws sqs get-queue-attributes --queue-url $(cdk outputs | grep QueueUrl | cut -d' ' -f2) --attribute-names All
```

### Test Message Processing
```bash
# Add item and check if message is sent to SQS
curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://www.amazon.com/dp/B08N5WRWNW"
  }'

# Check SQS queue for new messages
aws sqs receive-message --queue-url $(cdk outputs | grep QueueUrl | cut -d' ' -f2)
```

## 7. DynamoDB Integration Testing

### Check DynamoDB Table
```bash
# List items in DynamoDB table
aws dynamodb scan --table-name SmartWishlistTable --limit 10
```

### Check Specific User Data
```bash
# Query items for a specific user
aws dynamodb query \
  --table-name SmartWishlistTable \
  --key-condition-expression "PK = :pk" \
  --expression-attribute-values '{":pk":{"S":"USER#user-id"}}'
```

## 8. Performance Testing

### Test Multiple Concurrent Operations
```bash
# Create multiple wishlists concurrently
for i in {1..5}; do
  curl -X POST https://your-api-gateway-url/wishlist \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"name\": \"Concurrent Wishlist $i\"
    }" &
done
wait
```

### Test Multiple Item Additions
```bash
# Add multiple items concurrently
for i in {1..10}; do
  curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d "{
      \"url\": \"https://www.amazon.com/dp/B08N5WRWNW?item=$i\"
    }" &
done
wait
```

## 9. Expected Responses

### Successful Wishlist Creation
```json
{
  "wishlistId": "12345678-1234-1234-1234-123456789012",
  "name": "My Tech Wishlist"
}
```

### Successful Wishlist List
```json
[
  {
    "SK": "WISHLIST#12345678-1234-1234-1234-123456789012",
    "PK": "USER#87654321-4321-4321-4321-210987654321",
    "Name": "My Tech Wishlist",
    "CreatedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

### Successful Item Addition
```json
{
  "itemId": "87654321-4321-4321-4321-210987654321"
}
```

### Error Response Examples
```json
{
  "statusCode": 404,
  "message": "Wishlist with ID 00000000-0000-0000-0000-000000000000 not found",
  "error": "Not Found"
}
```

```json
{
  "statusCode": 400,
  "message": "Invalid URL format",
  "error": "Bad Request"
}
```

## 10. Monitoring and Verification

### Check Lambda Function Logs
```bash
# Check Lambda function logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/SmartWishlistApi"
aws logs get-log-events --log-group-name "/aws/lambda/SmartWishlistApi" --log-stream-name "LATEST"
```

### Check SQS Queue Status
```bash
# Check SQS queue attributes
aws sqs get-queue-attributes --queue-url $(cdk outputs | grep QueueUrl | cut -d' ' -f2) --attribute-names All
```

### Check DynamoDB Metrics
```bash
# Check DynamoDB table metrics
aws dynamodb describe-table --table-name SmartWishlistTable
```

## 11. Troubleshooting

### Common Issues and Solutions

1. **404 Not Found**: Check if wishlist exists and belongs to the user
2. **400 Bad Request**: Validate request payload and URL format
3. **401 Unauthorized**: Check JWT token validity
4. **500 Internal Server Error**: Check Lambda function logs and DynamoDB permissions

### Debug Commands
```bash
# Check DynamoDB table status
aws dynamodb describe-table --table-name SmartWishlistTable

# Check SQS queue status
aws sqs get-queue-attributes --queue-url $(cdk outputs | grep QueueUrl | cut -d' ' -f2)

# Check Lambda function configuration
aws lambda get-function-configuration --function-name SmartWishlistApi
```

This comprehensive testing guide covers all the wishlist features implemented with DynamoDB, Lambda, and SQS in your Smart Wishlist application! 📝

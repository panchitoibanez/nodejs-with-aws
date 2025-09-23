# Testing S3 and SNS Features - cURL Commands

This document provides comprehensive cURL commands to test the S3 and SNS features implemented in the Smart Wishlist application.

## Prerequisites

1. **Deploy the application** with S3 and SNS infrastructure
2. **Get the API Gateway URL** from CDK outputs
3. **Create a test user** and get JWT token
4. **Prepare test files** for upload testing

## 1. Authentication Setup

### Create a Test User
```bash
# Sign up a new user
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

### Sign In and Get JWT Token
```bash
# Sign in and get JWT token
 -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d curl'{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

**Save the JWT token from the response for use in subsequent requests.**

## 2. S3 Storage Features Testing

### Create a Test Wishlist
```bash
# Create a wishlist to test product image uploads
curl -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Wishlist for S3"
  }'
```

**Save the wishlist ID from the response.**

### Upload Product Image
```bash
# Upload a product image using the amazon.png file from repository root
curl -X POST https://your-api-gateway-url/storage/product-image/WISHLIST_ID/ITEM_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@amazon.png"
```

**Example with the amazon.png file:**
```bash
# Upload the amazon.png file (assuming you're in the repository root)
curl -X POST https://your-api-gateway-url/storage/product-image/12345678-1234-1234-1234-123456789012/87654321-4321-4321-4321-210987654321 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@amazon.png"
```

### Upload Profile Picture
```bash
# Upload a profile picture
curl -X POST https://your-api-gateway-url/storage/profile-picture \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/profile-picture.jpg"
```

### Get Signed URL for Private Access
```bash
# Get a signed URL for accessing a private object
curl -X GET https://your-api-gateway-url/storage/signed-url/products/WISHLIST_ID/ITEM_ID/timestamp-filename.jpg \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Object Metadata
```bash
# Get metadata for an uploaded object
curl -X GET https://your-api-gateway-url/storage/metadata/products/WISHLIST_ID/ITEM_ID/timestamp-filename.jpg \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Delete Object
```bash
# Delete an uploaded object
curl -X DELETE https://your-api-gateway-url/storage/products/WISHLIST_ID/ITEM_ID/timestamp-filename.jpg \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 3. SNS Notifications Testing

### Test Wishlist Creation Notifications
```bash
# Create a wishlist (this should trigger a notification)
curl -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Notification Test Wishlist"
  }'
```

### Test Item Addition Notifications
```bash
# Add an item to wishlist (this should trigger a notification)
curl -X POST https://your-api-gateway-url/wishlist/WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "url": "https://example.com/product"
  }'
```

### Test Wishlist Update Notifications
```bash
# Update a wishlist (this should trigger a notification)
curl -X PATCH https://your-api-gateway-url/wishlist/WISHLIST_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated Wishlist Name"
  }'
```

### Test Wishlist Deletion Notifications
```bash
# Delete a wishlist (this should trigger a notification)
curl -X DELETE https://your-api-gateway-url/wishlist/WISHLIST_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 4. Complete Integration Test Flow

### Step 1: Authentication
```bash
# Sign up
curl -X POST https://your-api-gateway-url/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration-test@example.com",
    "password": "IntegrationTest123!"
  }'

# Sign in and save token
TOKEN=$(curl -s -X POST https://your-api-gateway-url/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "integration-test@example.com",
    "password": "IntegrationTest123!"
  }' | jq -r '.accessToken')

echo "JWT Token: $TOKEN"
```

### Step 2: Create Wishlist (Triggers Notification)
```bash
# Create wishlist
WISHLIST_RESPONSE=$(curl -s -X POST https://your-api-gateway-url/wishlist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "S3 & SNS Integration Test"
  }')

WISHLIST_ID=$(echo $WISHLIST_RESPONSE | jq -r '.wishlistId')
echo "Wishlist ID: $WISHLIST_ID"
```

### Step 3: Upload Product Image
```bash
# Upload product image using amazon.png from repository root
curl -X POST https://your-api-gateway-url/storage/product-image/$WISHLIST_ID/test-item-123 \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@amazon.png"
```

### Step 4: Add Item to Wishlist (Triggers Notification)
```bash
# Add item to wishlist
curl -X POST https://your-api-gateway-url/wishlist/$WISHLIST_ID/item \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "url": "https://example.com/test-product"
  }'
```

### Step 5: Upload Profile Picture
```bash
# Upload profile picture using amazon.png from repository root
curl -X POST https://your-api-gateway-url/storage/profile-picture \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@amazon.png"
```

### Step 6: Test Signed URL Access
```bash
# Get signed URL for the uploaded product image (replace with actual timestamp and filename)
curl -X GET https://your-api-gateway-url/storage/signed-url/products/$WISHLIST_ID/test-item-123/timestamp-amazon.png \
  -H "Authorization: Bearer $TOKEN"
```

### Step 7: Clean Up
```bash
# Delete the test objects (replace with actual timestamp and filename)
curl -X DELETE https://your-api-gateway-url/storage/products/$WISHLIST_ID/test-item-123/timestamp-amazon.png \
  -H "Authorization: Bearer $TOKEN"

curl -X DELETE https://your-api-gateway-url/storage/profiles/USER_ID/timestamp-amazon.png \
  -H "Authorization: Bearer $TOKEN"

# Delete the wishlist
curl -X DELETE https://your-api-gateway-url/wishlist/$WISHLIST_ID \
  -H "Authorization: Bearer $TOKEN"
```

## 5. Error Testing

### Test File Upload Validation
```bash
# Test invalid file type
curl -X POST https://your-api-gateway-url/storage/product-image/$WISHLIST_ID/test-item \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/invalid-file.txt"

# Test file size limit
curl -X POST https://your-api-gateway-url/storage/product-image/$WISHLIST_ID/test-item \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/path/to/very-large-file.jpg"
```

### Test Unauthorized Access
```bash
# Test accessing someone else's files
curl -X GET https://your-api-gateway-url/storage/signed-url/products/OTHER_USER_WISHLIST/item/file.jpg \
  -H "Authorization: Bearer $TOKEN"
```

### Test Invalid Object Keys
```bash
# Test accessing non-existent objects
curl -X GET https://your-api-gateway-url/storage/metadata/non-existent-key \
  -H "Authorization: Bearer $TOKEN"
```

## 6. Monitoring and Verification

### Check S3 Bucket Contents
```bash
# Use AWS CLI to check S3 bucket contents
aws s3 ls s3://your-bucket-name --recursive
```

### Check SNS Topic Messages
```bash
# Use AWS CLI to check SNS topic
aws sns list-topics
aws sns get-topic-attributes --topic-arn YOUR_TOPIC_ARN
```

### Check CloudWatch Logs
```bash
# Check Lambda function logs
aws logs describe-log-groups --log-group-name-prefix "/aws/lambda/SmartWishlistApi"
aws logs get-log-events --log-group-name "/aws/lambda/SmartWishlistApi" --log-stream-name "LATEST"
```

## 7. Performance Testing

### Test Multiple File Uploads
```bash
# Upload multiple files concurrently
for i in {1..5}; do
  curl -X POST https://your-api-gateway-url/storage/product-image/$WISHLIST_ID/item-$i \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@test-image-$i.png" &
done
wait
```

### Test Large File Upload
```bash
# Create a larger test file (1MB)
dd if=/dev/zero of=large-test-file.jpg bs=1024 count=1024

# Upload large file
curl -X POST https://your-api-gateway-url/storage/product-image/$WISHLIST_ID/large-item \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@large-test-file.jpg"
```

## 8. Expected Responses

### Successful File Upload Response
```json
{
  "success": true,
  "data": {
    "key": "products/wishlist-id/item-id/timestamp-filename.jpg",
    "url": "https://bucket-name.s3.amazonaws.com/products/wishlist-id/item-id/timestamp-filename.jpg",
    "signedUrl": "https://bucket-name.s3.amazonaws.com/products/wishlist-id/item-id/timestamp-filename.jpg?X-Amz-Algorithm=...",
    "originalName": "filename.jpg",
    "size": 12345,
    "contentType": "image/jpeg"
  }
}
```

### Successful Signed URL Response
```json
{
  "success": true,
  "data": {
    "signedUrl": "https://bucket-name.s3.amazonaws.com/path/to/object?X-Amz-Algorithm=...",
    "expiresIn": 3600
  }
}
```

### Error Response Examples
```json
{
  "statusCode": 400,
  "message": "Invalid file type. Only images are allowed.",
  "error": "Bad Request"
}
```

```json
{
  "statusCode": 403,
  "message": "Access denied to this resource",
  "error": "Forbidden"
}
```

## 9. Troubleshooting

### Common Issues and Solutions

1. **401 Unauthorized**: Check JWT token validity
2. **403 Forbidden**: Verify user permissions and file access rights
3. **413 Payload Too Large**: File size exceeds limits
4. **415 Unsupported Media Type**: Invalid file type
5. **500 Internal Server Error**: Check AWS service permissions and configuration

### Debug Commands
```bash
# Check API Gateway logs
aws logs describe-log-groups --log-group-name-prefix "/aws/apigateway"

# Check S3 bucket policy
aws s3api get-bucket-policy --bucket your-bucket-name

# Check SNS topic policy
aws sns get-topic-attributes --topic-arn YOUR_TOPIC_ARN
```

This comprehensive testing guide covers all the S3 and SNS features implemented in your Smart Wishlist application! 🚀

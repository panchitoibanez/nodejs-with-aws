const {
    DynamoDBClient,
  } = require('@aws-sdk/client-dynamodb');
  const {
    DynamoDBDocumentClient,
    UpdateCommand,
  } = require('@aws-sdk/lib-dynamodb');
  
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  
  exports.handler = async (event) => {
    const records = event.Records;
    console.log(`Received ${records.length} messages from SQS.`);
  
    for (const record of records) {
      try {
        const messageBody = JSON.parse(record.body);
        const { userId, wishlistId, itemId, url } = messageBody;
  
        console.log(`Processing item ${itemId} for wishlist ${wishlistId}`);
  
        // --- TODO: In the future, real scraping logic will go here ---
        // For now, we simulate a successful scrape.
        const scrapedData = {
          title: `Scraped Title for ${url}`,
          price: (Math.random() * 100).toFixed(2), // Random price for demo
        };
        // --- End of simulation ---
  
        const command = new UpdateCommand({
          TableName: 'SmartWishlistTable', // In a real app, use env variables
          Key: {
            PK: `USER#${userId}`,
            SK: `WISHLIST#${wishlistId}#ITEM#${itemId}`,
          },
          UpdateExpression: 'set #N = :n, #P = :p, #S = :s',
          ExpressionAttributeNames: {
            '#N': 'Title',
            '#P': 'Price',
            '#S': 'Status',
          },
          ExpressionAttributeValues: {
            ':n': scrapedData.title,
            ':p': scrapedData.price,
            ':s': 'COMPLETED',
          },
        });
  
        await docClient.send(command);
        console.log(`Successfully updated item ${itemId} in DynamoDB.`);
  
        // If we reach here, the message is processed successfully.
        // SQS will automatically delete the message from the queue because our function didn't throw an error.
  
      } catch (error) {
        console.error(`Error processing message ${record.messageId}:`, error);
        // We'll let SQS handle the retry logic by not deleting the message on failure.
        // In a production app, you'd want a more robust dead-letter queue (DLQ) strategy.
      }
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify('Processing complete'),
    };
  };
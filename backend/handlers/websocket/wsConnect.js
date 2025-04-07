const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const params = {
    TableName: process.env.CONNECTIONS_TABLE,
    Item: { connectionId }
  };

  try {
    await dynamo.put(params).promise();
    return { statusCode: 200, body: 'Connected.' };
  } catch (err) {
    console.error('Connection error:', err);
    return { statusCode: 500, body: 'Failed to connect.' };
  }
};

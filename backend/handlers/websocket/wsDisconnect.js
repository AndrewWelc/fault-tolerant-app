const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const params = {
    TableName: process.env.CONNECTIONS_TABLE,
    Key: { connectionId }
  };

  try {
    await dynamo.delete(params).promise();
    return { statusCode: 200, body: 'Disconnected.' };
  } catch (err) {
    console.error('Disconnection error:', err);
    return { statusCode: 500, body: 'Failed to disconnect.' };
  }
};

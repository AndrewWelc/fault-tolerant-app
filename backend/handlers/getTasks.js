const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const data = await dynamo.scan({
      TableName: process.env.TASKS_TABLE
    }).promise();
    return {
      statusCode: 200,
      // TODO: remove this and add cors to serverless.yml properly
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:4200",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Amz-Security-Token,X-Api-Key"
      },
      body: JSON.stringify(data.Items || [])
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return {
      statusCode: 500,
      // TODO: remove this and add cors to serverless.yml properly
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:4200"
      },
      body: JSON.stringify({ error: 'Failed to retrieve tasks' })
    };
  }
};

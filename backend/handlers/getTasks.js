const AWS = require('aws-sdk');
const responseWithCors = require('./utils/responseWithCors');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const data = await dynamo.scan({
      TableName: process.env.TASKS_TABLE
    }).promise();

    return responseWithCors({
      statusCode: 200,
      body: data.Items || [],
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return responseWithCors({
      statusCode: 500,
      body: { error: 'Failed to retrieve tasks' },
    });
  }
};

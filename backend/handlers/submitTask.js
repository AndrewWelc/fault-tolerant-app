const AWS = require('aws-sdk');
const responseWithCors = require('../utils/responseWithCors');

const dynamo = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  try {
    const requestBody = event.body ? JSON.parse(event.body) : {}; 
    const taskId = requestBody.taskId || `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const answer = requestBody.answer || null;

    const newTask = {
      taskId,
      status: 'pending',
      retries: 0,
      answer,
      errorMessage: null,
    };

    await dynamo.put({
      TableName: process.env.TASKS_TABLE,
      Item: newTask,
    }).promise();

    await sqs.sendMessage({
      QueueUrl: process.env.TASKS_QUEUE_URL,
      MessageBody: taskId,
    }).promise();

    return responseWithCors({
      statusCode: 201,
      body: { message: 'Task received', taskId },
    });
  } catch (error) {
    console.error('Error in submitTask:', error);
    return responseWithCors({
      statusCode: 500,
      body: { error: 'Failed to submit task' },
    });
  }
};

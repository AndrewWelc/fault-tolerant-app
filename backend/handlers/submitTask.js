const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  try {
    const requestBody = event.body ? JSON.parse(event.body) : {}; 
    const taskId = requestBody.taskId || `${Date.now()}-${Math.floor(Math.random()*1000)}`;
    const answer = requestBody.answer || null;

    const newTask = {
      taskId: taskId,
      status: 'pending',
      retries: 0,
      answer: answer,
      errorMessage: null
    };

    await dynamo.put({
      TableName: process.env.TASKS_TABLE,
      Item: newTask
    }).promise();

    await sqs.sendMessage({
      QueueUrl: process.env.TASKS_QUEUE_URL,
      MessageBody: taskId
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Task received', taskId: taskId }),
      // TODO: remove this and add cors to serverless.yml properly
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:4200",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Amz-Security-Token,X-Api-Key"
      },
    };
  } catch (error) {
    console.error('Error in submitTask:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to submit task' }),
      // TODO: remove this and add cors to serverless.yml properly
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:4200",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Amz-Security-Token,X-Api-Key"
      },
    };
  }
};

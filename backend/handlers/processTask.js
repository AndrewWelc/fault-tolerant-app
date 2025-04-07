const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

const delay = ms => new Promise(res => setTimeout(res, ms));

const pushUpdate = async (updateData) => {
  const connectionsData = await dynamo.scan({
    TableName: process.env.CONNECTIONS_TABLE
  }).promise();
  
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: process.env.WEBSOCKET_ENDPOINT.replace('wss://', '')
  });

  const postCalls = connectionsData.Items.map(async (connection) => {
    try {
      await apigwManagementApi.postToConnection({
        ConnectionId: connection.connectionId,
        Data: JSON.stringify(updateData)
      }).promise();
    } catch (error) {
      if (error.statusCode === 410) {
        await dynamo.delete({
          TableName: process.env.CONNECTIONS_TABLE,
          Key: { connectionId: connection.connectionId }
        }).promise();
      } else {
        console.error(`Failed to send update to connection ${connection.connectionId}:`, error);
      }
    }
  });
  
  await Promise.all(postCalls);
};

exports.handler = async (event) => {
  const delayFactor = process.env.NODE_ENV === 'test' ? 0 : 1;
  
  for (const record of event.Records) {
    const taskId = record.body;
    let attempt = 0;
    let success = false;
    let lastError = null;
    
    console.log(`Processing task ${taskId}...`);

    while (attempt < 3 && !success) {
      try {
        attempt++;
        if (Math.random() < 0.3) {
          throw new Error('Simulated task failure');
        }
        await dynamo.update({
          TableName: process.env.TASKS_TABLE,
          Key: { taskId },
          UpdateExpression: "SET #st = :s, retries = :r",
          ExpressionAttributeNames: { "#st": "status" },
          ExpressionAttributeValues: {
            ":s": "success",
            ":r": attempt - 1
          }
        }).promise();
        console.log(`Task ${taskId} processed successfully on attempt #${attempt}`);
        success = true;
        await pushUpdate({ taskId, status: 'success', retries: attempt - 1 });
      } catch (err) {
        lastError = err;
        console.warn(`Task ${taskId} failed on attempt #${attempt}: ${err.message}`);
        if (attempt < 3) {
          const delaySecs = Math.pow(2, attempt - 1) * delayFactor;
          await delay(delaySecs * 1000);
          console.log(`Retrying task ${taskId} (attempt #${attempt + 1})...`);
        } else {
          await dynamo.update({
            TableName: process.env.TASKS_TABLE,
            Key: { taskId },
            UpdateExpression: "SET #st = :s, errorMessage = :e, retries = :r",
            ExpressionAttributeNames: { "#st": "status" },
            ExpressionAttributeValues: {
              ":s": "error",
              ":e": err.message,
              ":r": 2
            }
          }).promise();
          await sqs.sendMessage({
            QueueUrl: process.env.DLQ_QUEUE_URL,
            MessageBody: JSON.stringify({ taskId, error: err.message })
          }).promise();
          console.error(`Task ${taskId} failed after ${attempt} attempts. Sent to DLQ.`);
          await pushUpdate({ taskId, status: 'error', retries: 2, errorMessage: err.message });
        }
      }
    }
  }
};

const AWS = require('aws-sdk');
AWS.config.update({ region: 'eu-north-1' });

const STACK_NAME = 'fault-tolerant-app-backend-dev';
const FUNCTION_NAME = 'fault-tolerant-app-backend-dev-processTask'; 

const cloudformation = new AWS.CloudFormation();
const lambda = new AWS.Lambda();

async function getWebsocketEndpoint() {
  const result = await cloudformation.describeStacks({ StackName: STACK_NAME }).promise();
  const outputs = result.Stacks[0].Outputs;
  const wsOutput = outputs.find(o => o.OutputKey === 'ServiceEndpointWebsocket');
  if (!wsOutput) throw new Error('WebSocket endpoint output not found');
  return wsOutput.OutputValue;
}

async function updateLambdaEnvironment(wsEndpoint) {
  const config = await lambda.getFunctionConfiguration({ FunctionName: FUNCTION_NAME }).promise();
  const currentEnv = config.Environment ? config.Environment.Variables : {};
  currentEnv.WEBSOCKET_ENDPOINT = wsEndpoint;
  console.log(`Updating ${FUNCTION_NAME} with WEBSOCKET_ENDPOINT=${wsEndpoint}`);
  await lambda.updateFunctionConfiguration({
    FunctionName: FUNCTION_NAME,
    Environment: { Variables: currentEnv }
  }).promise();
  console.log('Lambda configuration updated.');
}

(async () => {
  try {
    const wsEndpoint = await getWebsocketEndpoint();
    await updateLambdaEnvironment(wsEndpoint);
  } catch (err) {
    console.error('Update script failed:', err);
  }
})();

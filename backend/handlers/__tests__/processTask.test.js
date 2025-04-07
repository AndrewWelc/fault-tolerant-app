const mockDynamo = {
  scan: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  promise: jest.fn()
};
const mockSQS = {
  sendMessage: jest.fn().mockReturnThis(),
  promise: jest.fn()
};
const mockApiGateway = {
  postToConnection: jest.fn().mockReturnThis(),
  promise: jest.fn().mockResolvedValue({})
};

jest.mock('aws-sdk', () => {
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDynamo)
    },
    SQS: jest.fn(() => mockSQS),
    ApiGatewayManagementApi: jest.fn(() => mockApiGateway)
  };
});

const AWS = require('aws-sdk');
const processTask = require('../processTask');

// Need to restore Math.random after tests
const originalMathRandom = global.Math.random;

describe('processTask handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.TASKS_TABLE = 'test-tasks-table';
    process.env.CONNECTIONS_TABLE = 'test-connections-table';
    process.env.WEBSOCKET_ENDPOINT = 'wss://test-endpoint';
    process.env.DLQ_QUEUE_URL = 'test-dlq-url';
  });

  afterEach(() => {
    global.Math.random = originalMathRandom;
    jest.useRealTimers();
  });

  test('should successfully process a task on first attempt', async () => {
    global.Math.random = () => 0.5;
    const event = {
      Records: [{ body: 'test-task-123' }]
    };

    mockDynamo.scan.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [{ connectionId: 'test-connection-1' }] })
    });
    mockDynamo.update.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });

    await processTask.handler(event);

    expect(mockDynamo.update).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'test-tasks-table',
        Key: { taskId: 'test-task-123' },
        UpdateExpression: "SET #st = :s, retries = :r",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":s": "success",
          ":r": 0
        }
      })
    );

    expect(mockApiGateway.postToConnection).toHaveBeenCalledWith(
      expect.objectContaining({
        ConnectionId: 'test-connection-1',
        Data: expect.stringContaining('success')
      })
    );
  }, 3000);

  test('should retry failed tasks up to 3 times', async () => {
    // Make sure task fails every time
    global.Math.random = () => 0.1;
    const event = {
      Records: [{ body: 'test-task-123' }]
    };

    jest.useFakeTimers();

    mockDynamo.scan.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [{ connectionId: 'test-connection-1' }] })
    });

    let attempt = 0;
    mockDynamo.update.mockReturnValue({
      promise: jest.fn().mockImplementation(() => {
        attempt++;
        if (attempt <= 3) {
          return { promise: jest.fn().mockRejectedValue(new Error('Simulated task failure')) };
        }
        return { promise: jest.fn().mockResolvedValue({}) };
      })
    });

    mockSQS.sendMessage.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });

    mockApiGateway.postToConnection.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });

    const handlerPromise = processTask.handler(event);

    // Skip retry delays
    while (jest.getTimerCount() > 0) {
      jest.runAllTimers();
      await Promise.resolve();
    }

    await handlerPromise;

    expect(mockDynamo.update).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'test-tasks-table',
        Key: { taskId: 'test-task-123' },
        UpdateExpression: "SET #st = :s, errorMessage = :e, retries = :r",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":s": "error",
          ":e": "Simulated task failure",
          ":r": 2
        }
      })
    );

    expect(mockSQS.sendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        QueueUrl: 'test-dlq-url',
        MessageBody: expect.stringContaining('test-task-123')
      })
    );
  }, 3000);

  test('should handle disconnected websocket connections', async () => {
    global.Math.random = () => 0.5;
    const event = {
      Records: [{ body: 'test-task-123' }]
    };

    mockDynamo.scan.mockReturnValue({
      promise: jest.fn().mockResolvedValue({ Items: [{ connectionId: 'test-connection-1' }] })
    });
    mockDynamo.update.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });
    mockApiGateway.postToConnection.mockReturnValue({
      promise: jest.fn().mockRejectedValue({ statusCode: 410 })
    });
    mockDynamo.delete.mockReturnValue({
      promise: jest.fn().mockResolvedValue({})
    });

    await processTask.handler(event);

    expect(mockDynamo.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        TableName: 'test-connections-table',
        Key: { connectionId: 'test-connection-1' }
      })
    );
  }, 3000);
});

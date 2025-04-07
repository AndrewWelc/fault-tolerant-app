const AWS = require('aws-sdk');
const submitTask = require('../submitTask');

jest.mock('aws-sdk', () => {
  const mockDynamo = {
    put: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  const mockSQS = {
    sendMessage: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDynamo)
    },
    SQS: jest.fn(() => mockSQS)
  };
});

describe('submitTask handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TASKS_TABLE = 'test-tasks-table';
    process.env.TASKS_QUEUE_URL = 'test-queue-url';
  });

  test('should successfully submit a task with provided taskId', async () => {
    const event = {
      body: JSON.stringify({
        taskId: 'test-task-123',
        answer: 'test answer'
      })
    };

    const result = await submitTask.handler(event);

    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual({
      message: 'Task received',
      taskId: 'test-task-123'
    });
  });

  test('should generate taskId if not provided', async () => {
    const event = {
      body: JSON.stringify({
        answer: 'test answer'
      })
    };

    const result = await submitTask.handler(event);
    const response = JSON.parse(result.body);

    expect(result.statusCode).toBe(201);
    expect(response.taskId).toMatch(/^\d+-\d+$/);
  });

  test('should handle empty request body', async () => {
    const event = {
      body: null
    };

    const result = await submitTask.handler(event);
    const response = JSON.parse(result.body);

    expect(result.statusCode).toBe(201);
    expect(response.taskId).toMatch(/^\d+-\d+$/);
  });

  test('should handle DynamoDB errors', async () => {
    const event = {
      body: JSON.stringify({
        taskId: 'test-task-123',
        answer: 'test answer'
      })
    };

    AWS.DynamoDB.DocumentClient().put().promise.mockRejectedValueOnce(new Error('DynamoDB error'));

    const result = await submitTask.handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Failed to submit task'
    });
  });

  test('should handle SQS errors', async () => {
    const event = {
      body: JSON.stringify({
        taskId: 'test-task-123',
        answer: 'test answer'
      })
    };

    AWS.SQS().sendMessage().promise.mockRejectedValueOnce(new Error('SQS error'));

    const result = await submitTask.handler(event);

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Failed to submit task'
    });
  });
}); 
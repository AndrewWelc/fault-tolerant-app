const AWS = require('aws-sdk');
const getTasks = require('../getTasks');

jest.mock('aws-sdk', () => {
  const mockDynamo = {
    scan: jest.fn().mockReturnThis(),
    promise: jest.fn()
  };
  return {
    DynamoDB: {
      DocumentClient: jest.fn(() => mockDynamo)
    }
  };
});

describe('getTasks handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.TASKS_TABLE = 'test-tasks-table';
  });

  test('should successfully retrieve tasks', async () => {
    const mockTasks = [
      { taskId: 'task-1', status: 'completed' },
      { taskId: 'task-2', status: 'pending' }
    ];

    AWS.DynamoDB.DocumentClient().scan().promise.mockResolvedValueOnce({
      Items: mockTasks
    });

    const result = await getTasks.handler({});

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockTasks);
  });

  test('should return empty array when no tasks exist', async () => {
    AWS.DynamoDB.DocumentClient().scan().promise.mockResolvedValueOnce({
      Items: []
    });

    const result = await getTasks.handler({});

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([]);
  });

  test('should handle DynamoDB errors', async () => {
    AWS.DynamoDB.DocumentClient().scan().promise.mockRejectedValueOnce(
      new Error('DynamoDB error')
    );

    const result = await getTasks.handler({});

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({
      error: 'Failed to retrieve tasks'
    });
  });
}); 
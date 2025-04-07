const dlqHandler = require('../dlqHandler');

const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe('dlqHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should log error for valid task failure message', async () => {
    const event = {
      Records: [{
        body: JSON.stringify({
          taskId: 'test-task-123',
          error: 'Test error message'
        })
      }]
    };

    await dlqHandler.handler(event);

    expect(console.error).toHaveBeenCalledWith(
      '❗ Task test-task-123 permanently failed. Error: Test error message'
    );
  });

  test('should log error for malformed message', async () => {
    const event = {
      Records: [{
        body: 'invalid json'
      }]
    };

    await dlqHandler.handler(event);

    expect(console.error).toHaveBeenCalledWith(
      '❗ DLQ received malformed message: "invalid json"'
    );
  });

  test('should handle multiple records', async () => {
    const event = {
      Records: [
        {
          body: JSON.stringify({
            taskId: 'test-task-1',
            error: 'Error 1'
          })
        },
        {
          body: JSON.stringify({
            taskId: 'test-task-2',
            error: 'Error 2'
          })
        }
      ]
    };

    await dlqHandler.handler(event);

    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith(
      '❗ Task test-task-1 permanently failed. Error: Error 1'
    );
    expect(console.error).toHaveBeenCalledWith(
      '❗ Task test-task-2 permanently failed. Error: Error 2'
    );
  });
}); 
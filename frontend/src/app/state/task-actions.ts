export class SubmitTask {
    static readonly type = '[Task] Submit';
    constructor(public payload: any) {}
}

  export class FetchTasks {
    static readonly type = '[Task] Fetch Tasks';
}

export class UpdateTaskStatus {
  static readonly type = '[Task] Update Task Status';
  constructor(public payload: { taskId: string, status: string, retries?: number, errorMessage?: string }) {}
}

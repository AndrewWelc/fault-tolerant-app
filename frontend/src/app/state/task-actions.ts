export class SubmitTask {
    static readonly type = '[Task] Submit';
    constructor(public payload: any) {}
  }

  export class FetchTasks {
    static readonly type = '[Task] Fetch Tasks';
  }
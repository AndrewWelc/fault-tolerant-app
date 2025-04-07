export class SubmitTask {
    static readonly type = '[Task] Submit';
    constructor(public payload: any) {}
}

  export class FetchTasks {
    static readonly type = '[Task] Fetch Tasks';
}

export class StartPolling {
  static readonly type = '[Task] Start Polling';
}

export class StopPolling {
  static readonly type = '[Task] Stop Polling';
}
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NgxsModule, Store } from '@ngxs/store';
import { TaskState, TaskStatus } from './task-state';
import { SubmitTask, FetchTasks, StartPolling, StopPolling } from './task-actions';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environment';

describe('TaskState', () => {
  let store: Store;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([TaskState]), HttpClientTestingModule],
    });

    store = TestBed.inject(Store);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should submit a task and update it to pending', () => {
    const task = { taskId: '1', answer: '42', status: TaskStatus.Pending, retries: 0 };
    store.dispatch(new SubmitTask(task)).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    const tasks = store.selectSnapshot(TaskState.tasks);
    expect(tasks.length).toBe(1);
    expect(tasks[0].status).toBe(TaskStatus.Pending);
  });

  it('should fetch tasks and patch state', () => {
    const mockTasks = [
      { taskId: '1', answer: 'Test', status: TaskStatus.Success, retries: 0 },
    ];

    store.dispatch(new FetchTasks()).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTasks);

    const tasks = store.selectSnapshot(TaskState.tasks);
    expect(tasks.length).toBe(1);
    expect(tasks[0].status).toBe(TaskStatus.Success);
  });

  it('should start polling and fetch multiple times', fakeAsync(() => {
    store.dispatch(new StartPolling());

    tick(5000);
    httpMock.expectOne(`${environment.apiUrl}/tasks`).flush([]);

    tick(5000);
    httpMock.expectOne(`${environment.apiUrl}/tasks`).flush([]);

    tick(5000);
    httpMock.expectOne(`${environment.apiUrl}/tasks`).flush([]);

    store.dispatch(new StopPolling());
  }));

  it('should stop polling and not fetch anymore', fakeAsync(() => {
    store.dispatch(new StartPolling());
    tick(5000);
    httpMock.expectOne(`${environment.apiUrl}/tasks`).flush([]);

    store.dispatch(new StopPolling());

    tick(6000);
    httpMock.verify(); 

    const tasks = store.selectSnapshot(TaskState.tasks);
    expect(Array.isArray(tasks)).toBeTrue();
  }));
});

import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { FetchTasks, SubmitTask, UpdateTaskStatus } from './task-actions';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { Subscription, throwError } from 'rxjs';
import { environment } from '../../environment';

export enum TaskStatus {
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

export interface Task {
  taskId: string;
  answer: string;
  status: TaskStatus;
  retries: number;
  errorMessage?: string;
}

export interface TaskStateModel {
  tasks: Task[];
}

@State<TaskStateModel>({
  name: 'taskState',
  defaults: {
    tasks: [],
  },
})
@Injectable()
export class TaskState {
  private pollingSubscription: Subscription | null = null;

  constructor(private http: HttpClient) {}

  @Selector()
  static tasks(state: TaskStateModel) {
    return state.tasks;
  }

  @Action(SubmitTask)
  submitTask(ctx: StateContext<TaskStateModel>, action: SubmitTask) {
    const task = action.payload;
    const state = ctx.getState();
    ctx.patchState({ tasks: [...state.tasks, task] });

    return this.http.post(`${environment.apiUrl}/tasks`, task).pipe(
      tap(() => {
        const updated = ctx
          .getState()
          .tasks.map((t) =>
            t.taskId === task.taskId ? { ...t, status: TaskStatus.Pending } : t,
          );
        ctx.patchState({ tasks: updated });
      }),
      catchError((err) => {
        const updated = ctx.getState().tasks.map((t) =>
          t.taskId === task.taskId
            ? {
                ...t,
                status: TaskStatus.Error,
                errorMessage: err.message || 'Error',
                retries: t.retries + 1,
              }
            : t,
        );
        ctx.patchState({ tasks: updated });
        return throwError(() => err);
      }),
    );
  }

  @Action(FetchTasks)
  fetchTasks(ctx: StateContext<TaskStateModel>) {
    return this.http.get<Task[]>(`${environment.apiUrl}/tasks`).pipe(
      tap((tasks) => {
        ctx.patchState({ tasks });
      }),
      catchError((err) => {
        console.error('Failed to fetch tasks', err);
        return throwError(() => err);
      }),
    );
  }

  @Action(UpdateTaskStatus)
  updateTaskStatus(ctx: StateContext<TaskStateModel>, action: UpdateTaskStatus) {
    const { taskId, status, retries, errorMessage } = action.payload;
    const state = ctx.getState();
    const updatedTasks = state.tasks.map((task) =>
      task.taskId === taskId
        ? {
            ...task,
            status: status as TaskStatus,
            retries: retries !== undefined ? retries : task.retries,
            errorMessage,
          }
        : task,
    );
    ctx.patchState({ tasks: updatedTasks });
  }
}

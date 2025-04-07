import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { finalize, Observable, take } from 'rxjs';
import { FetchTasks, StartPolling, StopPolling } from 'src/app/state/task-actions';
import { TaskState, Task } from 'src/app/state/task-state';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.scss']
})
export class TaskDashboardComponent {
  @Select(TaskState.tasks) tasks$!: Observable<Task[]>;
  isLoading = false;

  @Input() isMobile: boolean = false;
  
  constructor(private store: Store) {}

  ngOnInit() {
    this.tasks$.pipe(take(1)).subscribe(tasks => {
      if (!tasks || tasks.length === 0) {
        this.refresh();
      }
    });
  
    this.store.dispatch(new StartPolling());
  }

  ngOnDestroy() {
    this.store.dispatch(new StopPolling());
  }

  refresh() {
    this.isLoading = true;
    this.store.dispatch(new FetchTasks())
      .pipe(finalize(() => this.isLoading = false))
      .subscribe();
  }
}


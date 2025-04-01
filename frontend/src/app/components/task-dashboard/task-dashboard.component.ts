import { Component, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { FetchTasks } from 'src/app/state/task-actions';
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
    this.refresh();
  }

  refresh() {
    this.isLoading = true;
    this.store.dispatch(new FetchTasks()).subscribe({
      next: () => (this.isLoading = false),
      error: () => (this.isLoading = false),
    });
  }
}


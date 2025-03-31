import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TaskState, Task } from 'src/app/state/task-state';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.scss']
})
export class TaskDashboardComponent {
  @Select(TaskState.tasks) tasks$!: Observable<Task[]>;

  constructor(private store: Store) {}

  refresh() {
    console.log('refreshing...');
  }
}

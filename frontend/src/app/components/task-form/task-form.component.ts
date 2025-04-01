import { Component, Input } from '@angular/core';
import { Store } from '@ngxs/store';
import { SubmitTask } from 'src/app/state/task-actions';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent {
  answer = '';

  constructor(private store: Store) {}

  @Input() isMobile: boolean = false;

  submit() {
    const task = {
      taskId: uuidv4(),
      answer: this.answer,
      status: 'pending',
      retries: 0
    };
    this.store.dispatch(new SubmitTask(task));
    this.answer = '';
  }
}

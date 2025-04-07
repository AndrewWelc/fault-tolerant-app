import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  isSubmitting = false;

  constructor(private store: Store, private snackBar: MatSnackBar) {}

  @Input() isMobile: boolean = false;

  submit() {
    if (!this.answer.trim()) {
      this.snackBar.open('Please enter your answer before submitting.', '', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
      });
      return;
    }

    const task = {
      taskId: uuidv4(),
      answer: this.answer.trim(),
      status: 'pending',
      retries: 0
    };

    this.isSubmitting = true;

    this.store.dispatch(new SubmitTask(task)).subscribe({
      next: () => {
        this.answer = '';
        this.isSubmitting = false;
        this.snackBar.open('Task submitted successfully!', '', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'right',
        });
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBar.open('Something went wrong', '', {
          duration: 3000,
          panelClass: ['snackbar-error'],
          horizontalPosition: 'right',
        });
      }
    });
  }
}

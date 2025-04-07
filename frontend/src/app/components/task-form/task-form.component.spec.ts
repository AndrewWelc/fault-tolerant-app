import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { FormsModule } from '@angular/forms';
import { NgxsModule, Store } from '@ngxs/store';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SubmitTask } from 'src/app/state/task-actions';
import { of } from 'rxjs';
import { TaskHeaderComponent } from '../task-header/task-header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskFormComponent, TaskHeaderComponent],
      imports: [
        FormsModule,
        MatSnackBarModule,
        NgxsModule.forRoot([]),
        BrowserAnimationsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should disable submission if answer is empty', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.answer = '';
    component.submit();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should dispatch SubmitTask if answer is filled', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.returnValue(of({}));
    component.answer = 'Example answer';
    component.submit();
    expect(dispatchSpy).toHaveBeenCalled();
    const action = dispatchSpy.calls.first().args[0];
    expect(action).toBeInstanceOf(SubmitTask);
    expect(action.payload.answer).toBe('Example answer');
  });

  it('should reset answer and isSubmitting after success', () => {
    spyOn(store, 'dispatch').and.returnValue(of({}));
    component.answer = 'Hello!';
    component.isSubmitting = true;
    component.submit();
    expect(component.answer).toBe('');
    expect(component.isSubmitting).toBeFalse();
  });
});

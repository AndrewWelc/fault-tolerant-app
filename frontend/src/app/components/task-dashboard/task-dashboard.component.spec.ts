import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskDashboardComponent } from './task-dashboard.component';
import { NgxsModule, Store } from '@ngxs/store';
import { FetchTasks } from 'src/app/state/task-actions';
import { TaskState, Task } from 'src/app/state/task-state';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TaskDashboardComponent', () => {
  let component: TaskDashboardComponent;
  let fixture: ComponentFixture<TaskDashboardComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDashboardComponent],
      imports: [NgxsModule.forRoot([TaskState]), HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDashboardComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);

    spyOn(store, 'select').and.returnValue(of([
      {
        taskId: '123',
        answer: 'Test',
        status: 'success',
        retries: 0
      } as Task
    ]));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call FetchTasks on refresh()', () => {
    const dispatchSpy = spyOn(store, 'dispatch').and.returnValue(of({}));
    component.refresh();
    expect(dispatchSpy).toHaveBeenCalledWith(new FetchTasks());
  });

  it('should render task list in DOM', () => {
    const taskRows = fixture.nativeElement.querySelectorAll('.table-row, .task-card');
    expect(taskRows.length).toBeGreaterThan(0);
  });
});

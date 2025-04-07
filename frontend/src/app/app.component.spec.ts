import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { NgxsModule } from '@ngxs/store';
import { TaskState } from './state/task-state';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';
import { TaskHeaderComponent } from './components/task-header/task-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent, MainLayoutComponent, TaskFormComponent, TaskDashboardComponent, TaskHeaderComponent
      ],
      imports: [NgxsModule.forRoot([TaskState]), HttpClientTestingModule, MatSnackBarModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'fault-tolerant-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('fault-tolerant-app');
  });

});

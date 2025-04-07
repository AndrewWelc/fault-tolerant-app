import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxsModule } from '@ngxs/store';
import { TaskState } from './state/task-state';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';
import { TaskHeaderComponent } from './components/task-header/task-header.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    TaskDashboardComponent,
    MainLayoutComponent,
    StatusBadgeComponent,
    TaskHeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    FormsModule,
    HttpClientModule,
    NgxsModule.forRoot([TaskState]),
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsModule } from '@ngxs/store';
import { TaskState } from './state/task-state';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskDashboardComponent } from './components/task-dashboard/task-dashboard.component';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskFormComponent,
    TaskDashboardComponent,
    MainLayoutComponent,
    StatusBadgeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgxsModule.forRoot([TaskState]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

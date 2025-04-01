import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-header',
  templateUrl: './task-header.component.html',
  styleUrls: ['./task-header.component.scss']
})
export class TaskHeaderComponent {
  @Input() isMobile: boolean = false;
  @Input() menuOpen: boolean = false;

  @Output() toggleMenu = new EventEmitter<void>();
  @Output() switchView = new EventEmitter<'form' | 'dashboard'>();

  onSwitch(view: 'form' | 'dashboard') {
    this.switchView.emit(view);
    this.toggleMenu.emit();
  }

  onToggleMenu() {
    this.toggleMenu.emit();
  }
}

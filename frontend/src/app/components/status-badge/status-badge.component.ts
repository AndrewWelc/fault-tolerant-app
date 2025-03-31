import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `<span [ngClass]="status" class="badge">{{ status | titlecase }}</span>`,
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() status!: 'pending' | 'success' | 'error';
}

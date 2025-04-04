import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  template: `
  <span [ngClass]="status" class="badge">
    <img
      class="icon"
      [src]="'assets/icons/' + status.toLowerCase() + '.svg'"
      [alt]="status"
    />
      {{ statusLabels[status] }}
  </span>
`,
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() status!: 'pending' | 'success' | 'error';

  statusLabels: Record<typeof this.status, string> = {
    pending: 'Pending',
    success: 'Processed',
    error: 'Failed'
  };
}

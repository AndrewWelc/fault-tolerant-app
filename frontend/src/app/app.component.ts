import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebsocketService } from './services/websocket.service';
import { Store } from '@ngxs/store';
import { UpdateTaskStatus } from './state/task-actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'fault-tolerant-app';
  private wsSubscription: Subscription | null = null;

  constructor(private wsService: WebsocketService, private store: Store) {}

  ngOnInit() {
    this.wsService.connect();

    this.wsSubscription = this.wsService.messages$.subscribe(message => {
      this.store.dispatch(new UpdateTaskStatus(message));
    });
  }

  ngOnDestroy() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.wsService.disconnect();
  }
}

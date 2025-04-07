import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | undefined;
  public messages$: Subject<any> = new Subject();

  connect() {
    this.socket = new WebSocket(environment.websocketUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connected.');
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received update:', data);
      this.messages$.next(data);
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

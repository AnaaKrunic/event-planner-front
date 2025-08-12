import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private client: Client;
  private notifications: string[] = [];

  constructor() {
    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      reconnectDelay: 5000,
      debug: (str: string) => console.log(str),
    });
  }

  connect(userId: string, callback: (message: any) => void): void {
    this.client.onConnect = () => {
      // Pretplata na obaveštenja za korisnika
      this.client.subscribe(`/user/${userId}/topic/notifications`, (message: IMessage) => {
        const notification = JSON.parse(message.body);
        this.notifications.push(notification);
        callback(notification);
      });
    };

    this.client.activate();
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
    }
  }

  getNotifications(): string[] {
    return this.notifications;
  }
}

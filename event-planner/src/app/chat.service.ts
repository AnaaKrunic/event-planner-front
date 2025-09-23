// chat.service.ts
import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';

export interface ChatMessage {
  sender: string;
  content: string;
  type: 'JOIN' | 'LEAVE' | 'CHAT';
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private client: Client | null = null;

  connectionStatus: Subject<boolean> = new Subject<boolean>();
  messageSubject: Subject<ChatMessage> = new Subject<ChatMessage>();

  connect(username: string) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      debug: (str) => console.log(str)
    });

    this.client.onConnect = (frame) => {
      console.log('Connected: ', frame);
      this.connectionStatus.next(true); // Obaveštava komponentu da je konektovan

      this.client?.subscribe('/topic/public', (message: Message) => {
        console.log('Received: ', message.body);
        const parsedMessage: ChatMessage = JSON.parse(message.body);
        this.messageSubject.next(parsedMessage);
      });

      this.client?.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({ sender: username, type: 'JOIN', content: '' })
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Broker reported error: ', frame.headers['message']);
      console.error('Details: ', frame.body);
    };

    this.client.activate();
  }

  sendMessage(username: string, message: string) {
    this.client?.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ sender: username, content: message, type: 'CHAT' })
    });
  }
}

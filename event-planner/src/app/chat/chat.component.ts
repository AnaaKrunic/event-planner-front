// chat.component.ts
import { Component, OnInit } from '@angular/core';
import { ChatService, ChatMessage } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  username: string = 'pera'; // privremeno hardkodirano
  message: string = '';
  messages: ChatMessage[] = [];
  connected: boolean = false;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Prati konekciju
    this.chatService.connectionStatus.subscribe((status: boolean) => {
      this.connected = status;
    });

    // Prati pristigle poruke
    this.chatService.messageSubject.subscribe((msg: ChatMessage) => {
      this.messages.push(msg);
    });

    this.chatService.connect(this.username);
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.username, this.message.trim());
      this.message = '';
    }
  }
}

import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatService, ChatMessage } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @Input() username!: string;   // dolazi spolja
  @Input() recipient!: string;  // drugi korisnik (ako backend očekuje)

  message: string = '';
  messages: ChatMessage[] = [];
  connected: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.chatService.connectionStatus.subscribe((status: boolean) => {
        this.connected = status;
      })
    );

    this.subscriptions.push(
      this.chatService.messageSubject.subscribe((msg: ChatMessage) => {
        this.messages.push(msg);
      })
    );

    this.chatService.connect(this.username);
  }

  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.username, this.message.trim());
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.chatService.disconnect(); // da se zatvori konekcija kad se komponenta uništi
  }
}

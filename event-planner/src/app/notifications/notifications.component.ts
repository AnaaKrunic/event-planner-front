import { Component, OnInit } from '@angular/core';
import {NotificationService} from '../notifications.service';
import {AuthService} from '../authservice.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];
  isLoading: boolean = true;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !user.id) {
      console.error('User not logged in or user ID is missing. Cannot load notifications.');
      return;
    }

    const userId = user.id;

    this.notificationService.connect(userId, (notification) => {
      this.notifications.push(notification);
      console.log('New notification:', notification);
    });

    this.isLoading = false;
  }


  ngOnDestroy(): void {
    this.notificationService.disconnect();
  }
}

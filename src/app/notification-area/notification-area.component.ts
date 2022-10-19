import { Component, OnInit } from '@angular/core';

import { BackendService, PredefinedEvent, Event, UserSubmittedEvent, UserEventObserverMessage } from '../backend.service';


interface Notification {
  added_time: Date,
  date: string,
  subject: string,
  description: string,
};


@Component({
  selector: 'app-notification-area',
  templateUrl: './notification-area.component.html',
  styleUrls: ['./notification-area.component.scss']
})
export class NotificationAreaComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.backendService.SubscribeUserEvents(
      ({events}: UserEventObserverMessage) => {
        this.notifications = [];

        for (let event of events) {
          const time = new Date(event.added_time! * 1000);
          const notification: Notification = {
            added_time: time,
            date: event.date,
            subject: event.subject,
            description: event.description,
          }
          this.notifications.push(notification);
        }

        this.notifications.sort((a, b) => {
          if (a.added_time > b.added_time) {
            return 1;
          }
          if (a.added_time < b.added_time) {
            return -1;
          }
          return 0;
        });
        this.notifications = this.notifications.slice(-10);
      });
  }

}

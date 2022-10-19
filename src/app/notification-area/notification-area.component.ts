import { Component, OnInit } from '@angular/core';

import { BackendService, UserSubmittedEvent, UserEventObserverMessage } from '../backend.service';
import { EventBus } from '../event-bus.service'


interface Notification {
  added_time: Date,
  date: string,
  subject: string,
  description: string,
  event: UserSubmittedEvent,
};


@Component({
  selector: 'app-notification-area',
  templateUrl: './notification-area.component.html',
  styleUrls: ['./notification-area.component.scss']
})
export class NotificationAreaComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private backendService: BackendService, private eventBus: EventBus) { }

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
            event: event,
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

  onClick(index: number) {
    this.eventBus.SetUserEvent(this.notifications[index].event);
  }

}

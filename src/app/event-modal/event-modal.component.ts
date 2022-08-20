import { Component, OnInit } from '@angular/core';

import { EventService } from '../event-service.service';
import { PredefinedEvent } from '../events.service';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {
  event?: PredefinedEvent;

  constructor(private eventService: EventService) {
    this.eventService.SetPredefinedEventEvent.subscribe(
      (event: PredefinedEvent) => {
        this.event = event;
      }
    );
  }

  ngOnInit(): void {
  }

  onClick() {
    this.event = undefined;
  }

  GetStyle() {
    return {};
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { EventBus } from '../event-bus.service';
import { PredefinedEvent, UserSubmittedEvent } from '../events.service';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit {
  @ViewChild('modal') modalElement!: ElementRef;

  predefinedEvent?: PredefinedEvent;
  userEvent?: UserSubmittedEvent;

  constructor(private eventBus: EventBus) {
    this.eventBus.SetPredefinedEventEvent.subscribe(
      (predefinedEvent: PredefinedEvent) => {
        this.clearEvents();
        this.predefinedEvent = predefinedEvent;
        this.modalElement.nativeElement.focus();
      }
    );

    this.eventBus.SetUserEventEvent.subscribe(
      (userEvent: UserSubmittedEvent) => {
        this.clearEvents();
        this.userEvent = userEvent;
        this.modalElement.nativeElement.focus();
      }
    );
  }

  ngOnInit(): void {
  }

  clearEvents() {
    this.predefinedEvent = undefined;
    this.userEvent = undefined;
  }

  onBlur() {
    this.clearEvents();
  }

  getStyle() {
    return {};
  }
}

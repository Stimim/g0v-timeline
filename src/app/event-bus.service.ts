import { Injectable, EventEmitter } from '@angular/core';

import { PredefinedEvent, UserSubmittedEvent } from './backend.service';


@Injectable({
  providedIn: 'root'
})
export class EventBus {

  SetPredefinedEventEvent = new EventEmitter<PredefinedEvent>();
  SetUserEventEvent = new EventEmitter<UserSubmittedEvent>();

  constructor() { }

  SetPredefinedEvent(event: PredefinedEvent) {
    this.SetPredefinedEventEvent.emit(event);
  }

  SetUserEvent(event: UserSubmittedEvent) {
    this.SetUserEventEvent.emit(event);
  }
}

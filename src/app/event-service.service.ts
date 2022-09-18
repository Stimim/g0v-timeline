import { Injectable, EventEmitter } from '@angular/core';


import { PredefinedEvent, UserSubmittedEvent } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

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

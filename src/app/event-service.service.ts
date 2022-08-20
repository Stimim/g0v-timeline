import { Injectable, EventEmitter } from '@angular/core';


import { PredefinedEvent } from './events.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  SetPredefinedEventEvent = new EventEmitter<PredefinedEvent>();

  constructor() { }

  SetPredefinedEvent(event: PredefinedEvent) {
    this.SetPredefinedEventEvent.emit(event);
  }
}

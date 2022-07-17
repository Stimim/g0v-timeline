import { Injectable } from '@angular/core';

import { EVENTS } from './data/g0v-events';

enum EventType {
  Predefined = 0,
  UserSubmitted = 1,
};

export interface PredefinedEvent {
  //type: EventType;
  date: string;
  subject: string;
  action: string;
  object: string;
  description?: string;
  ref_title?: string;
  ref_url?: string;
  location?: string;
};

export interface UserSubmittedEvent {
  //type: EventType;
  date: string;
  subject: string;
  description: string;
};

type Event = PredefinedEvent | UserSubmittedEvent;

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor() { }

  GetPredefinedEvents(/*beginTime, endTime*/): PredefinedEvent[] {
    return EVENTS;
  }
}

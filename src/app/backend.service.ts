import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EVENTS } from './data/g0v-events';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { EventEmitter } from '@angular/core';


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
  topic: string;
  description?: string;
  ref_title?: string;
  ref_url?: string;
  location?: string;
};

export interface UserSubmittedEvent {
  //type: EventType;
  id?: number;
  added_time?: number;
  date: string;
  subject: string;
  description: string;
};

export type Event = PredefinedEvent | UserSubmittedEvent;


export interface UserEventObserverMessage {
  events: UserSubmittedEvent[];
};

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) { }

  UserEventsEmitter = new EventEmitter<UserEventObserverMessage>();
  user_events_observable?: Observable<UserEventObserverMessage> = undefined;
  worker?: Worker = undefined;

  SubscribeUserEvents(callback: (v: UserEventObserverMessage) => void) {
    if (this.worker === undefined && typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker(new URL('./app.worker', import.meta.url));
      this.worker.onmessage = (message : any) => {
        this.UserEventsEmitter.emit(message.data);
      };
      this.worker.postMessage('hello');
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
    return this.UserEventsEmitter.subscribe(callback);
  }

  SubmitOneUserEvent(event: UserSubmittedEvent, token: string): Observable<object> {
    const formData = new FormData();
    formData.append('date', event.date);
    formData.append('subject', event.subject);
    formData.append('description', event.description);
    formData.append('token', token);
    return this.http.post<UserSubmittedEvent>(
      'https://g0v-10th-timeline-add-event-wo3ndgqh4q-de.a.run.app/',
      formData);
  }

  GetPredefinedEvents(/*beginTime, endTime*/): PredefinedEvent[] {
    return EVENTS;
  }

  TakeDownEvent(event_id: string, secret: string) {
    const formData = new FormData();
    formData.append('event_id', event_id);
    formData.append('secret', secret);
    return this.http.post<UserSubmittedEvent>(
      'https://g0v-10th-timeline-take-down-event-wo3ndgqh4q-de.a.run.app/',
      formData);
  }
};

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EVENTS } from './data/g0v-events';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


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
  date: string;
  subject: string;
  description: string;
};

export type Event = PredefinedEvent | UserSubmittedEvent;


export interface OnlineEventObserverMessage {
  events: UserSubmittedEvent[];
  is_update: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) { }

  online_events_observer?: Observable<OnlineEventObserverMessage> = undefined;

  GetOnlineEvents(): Observable<UserSubmittedEvent[]> {
    return this.http.get<UserSubmittedEvent[]>(
      'https://g0v-10th-timeline-get-events-wo3ndgqh4q-de.a.run.app/');
  }

  GetOnlineEventsObserver() {
    if (this.online_events_observer === undefined) {
      this.online_events_observer = new Observable((subscriber) => {
        const url = 'https://g0v-10th-timeline-get-events-wo3ndgqh4q-de.a.run.app/';
        const known_events: {[key: number]: boolean} = {};
        let last_timestamp = 0;
        let is_update = false;

        const callback = (response: any) => {
          const events: UserSubmittedEvent[] = response.results;
          const retval: UserSubmittedEvent[] = [];
          for (let event of events) {
            const id = event.id!;
            if (id in known_events) {
              continue;
            }
            retval.push(event);
            known_events[id] = true;
          }
          subscriber.next({events: retval, is_update});

          last_timestamp = (new Date()).getTime() / 1000;
          is_update = true;

          setTimeout(looper, 30 * 1000);
        };

        const looper = () => {
          const param = `?after_timestamp=${last_timestamp}`;
          this.http.get<UserSubmittedEvent[]>(url + param).subscribe(callback);
        };

        this.http.get<UserSubmittedEvent[]>(url).subscribe(callback);
      });
    }
    return this.online_events_observer!;
  }

  SubmitOneOnline(event: UserSubmittedEvent, token: string) : Observable<object> {
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
};

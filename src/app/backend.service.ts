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
  date: string;
  subject: string;
  description: string;
};

export type Event = PredefinedEvent | UserSubmittedEvent;

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  constructor(private http: HttpClient) { }

  GetOnlineEvents(): Observable<UserSubmittedEvent[]> {
    return this.http.get<UserSubmittedEvent[]>(
      'https://g0v-10th-timeline-get-events-wo3ndgqh4q-de.a.run.app/');
  }

  SubmitOneOnline(event: UserSubmittedEvent) : Observable<object> {
    const formData = new FormData();
    formData.append('date', event.date);
    formData.append('subject', event.subject);
    formData.append('description', event.description);
    return this.http.post<UserSubmittedEvent>(
      'https://g0v-10th-timeline-add-event-wo3ndgqh4q-de.a.run.app',
      formData);
  }

  GetPredefinedEvents(/*beginTime, endTime*/): PredefinedEvent[] {
    return EVENTS;
  }
};

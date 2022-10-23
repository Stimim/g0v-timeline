/// <reference lib="webworker" />

import { Observable } from 'rxjs';

export interface UserSubmittedEvent {
  //type: EventType;
  id?: number;
  added_time?: number;
  date: string;
  subject: string;
  description: string;
};

const _SYNC_INTERVAL_MS = 5 * 1000;

addEventListener('message', ({ data }) => {
  const user_events_observable = new Observable((subscriber) => {
    const url = 'https://g0v-10th-timeline-get-events-wo3ndgqh4q-de.a.run.app/';

    const callback = (response: any) => {
      const events: UserSubmittedEvent[] = response.results;
      subscriber.next({ events })
    };

    const looper = async () => {
      try {
        let response = await fetch(url);

        if (response.ok) { // if HTTP-status is 200-299
          // get the response body (the method explained below)
          let json = await response.json();
          callback(json);
        } else {
          console.log("HTTP-Error: " + response.status);
        }
      } finally {
        setTimeout(looper, _SYNC_INTERVAL_MS);
      }
    };
    looper();
  });
  user_events_observable.subscribe(
    (eventMessage) => {
      postMessage(eventMessage);
    });
});

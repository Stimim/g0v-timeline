import { Component } from '@angular/core';

import { EventsService, PredefinedEvent } from './events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'g0v-timeline';

  predefinedEvents: PredefinedEvent[] = [];

  constructor(private eventsService: EventsService) {
    this.predefinedEvents = eventsService.GetPredefinedEvents();
  }

  GetStyle() {
    return {
      'background-color': 'red',
      'width': '10000px',
      'height': '100px',
    };
  }
}

import { Component } from '@angular/core';

import { EventsService, PredefinedEvent, Event, UserSubmittedEvent } from './events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }
}

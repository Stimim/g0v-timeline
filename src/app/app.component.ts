import { Component } from '@angular/core';

import { BackendService, PredefinedEvent, Event, UserSubmittedEvent } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor() { }
}

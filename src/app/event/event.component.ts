import { Component, OnInit, Input } from '@angular/core';

import { PredefinedEvent } from '../events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  @Input() event!: PredefinedEvent;

  constructor() { }

  ngOnInit(): void {
  }

}

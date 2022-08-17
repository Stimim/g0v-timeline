import { Component, OnInit, Input } from '@angular/core';

import { PredefinedEvent } from '../events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  @Input() event!: PredefinedEvent;
  @Input() offset!: [number, number];

  constructor() { }

  ngOnInit(): void {
  }

  GetStyle() {
    return {
      'margin-left': `${this.offset[0]}px`
    };
  }

}

import { Component, OnInit, Input } from '@angular/core';

import { EventService } from '../event-service.service'
import { PredefinedEvent } from '../events.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {

  @Input() minVisibleX!: number;
  @Input() maxVisibleX!: number;

  @Input() event!: PredefinedEvent;
  @Input() offset!: [number, number];

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
  }

  GetCardStyle() {
    let z = Math.floor(window.innerWidth*2 - Math.abs(window.innerWidth/2 - this.offset[0]));
    let shouldDisplay = (this.minVisibleX <= this.offset[0] &&
                         this.offset[0] <= this.maxVisibleX);

    return {
      display: shouldDisplay ? 'block' : 'none',
      position: 'absolute',
      left: `${this.offset[0]}px`,
      top: `${this.offset[1]}px`,
      'z-index': `${z}`
    };
  }

  onClick() {
    this.eventService.SetPredefinedEventEvent.emit(this.event);
  }
}

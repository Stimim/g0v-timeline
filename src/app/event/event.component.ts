import { Component, OnInit, Input } from '@angular/core';

import { EventBus } from '../event-bus.service'
import { PredefinedEvent } from '../backend.service';

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

  constructor(private eventBus: EventBus) { }

  ngOnInit(): void {
  }

  GetCardStyle() {
    let z = Math.floor(window.innerWidth*2 - Math.abs(window.innerWidth/2 - this.offset[0]));
    let shouldDisplay = (this.minVisibleX <= this.offset[0] &&
                         this.offset[0] <= this.maxVisibleX);

    return {
      display: 'block',
      transition: 'opacity .5s',
      'transition-timing-function': 'linear',
      opacity: shouldDisplay ? '1' : '0',
      position: 'absolute',
      left: `${this.offset[0]}px`,
      top: `${this.offset[1]}px`,
      'z-index': `${z}`
    };
  }

  onClick() {
    this.eventBus.SetPredefinedEventEvent.emit(this.event);
  }
}

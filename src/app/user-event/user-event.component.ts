import { Component, OnInit, Input } from '@angular/core';
import { UserSubmittedEvent } from '../backend.service';
import { EventBus } from '../event-bus.service'

@Component({
  selector: 'app-user-event',
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.scss']
})
export class UserEventComponent implements OnInit {
  @Input() minVisibleX!: number;
  @Input() maxVisibleX!: number;
  @Input() event!: UserSubmittedEvent;
  @Input() offset!: number[];

  constructor(private eventBus: EventBus) { }

  ngOnInit(): void {
  }

  GetStyle() {
    let isVisible = (this.minVisibleX <= this.offset[0] &&
                     this.offset[0] <= this.maxVisibleX);
    return {
      display: isVisible ? 'block' : 'none',
      position: 'absolute',
      left: `${this.offset[0]}px`,
      top: `${this.offset[1]}px`,
    };
  }

  onClick() {
    this.eventBus.SetUserEvent(this.event);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { UserSubmittedEvent } from '../backend.service';

@Component({
  selector: 'app-online-event',
  templateUrl: './online-event.component.html',
  styleUrls: ['./online-event.component.scss']
})
export class OnlineEventComponent implements OnInit {
  @Input() minVisibleX!: number;
  @Input() maxVisibleX!: number;
  @Input() event!: UserSubmittedEvent;
  @Input() offset!: number[];

  constructor() { }

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
}

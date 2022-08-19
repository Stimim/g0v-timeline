import { Component, OnInit, Input } from '@angular/core';
import { UserSubmittedEvent } from '../events.service';

@Component({
  selector: 'app-online-event',
  templateUrl: './online-event.component.html',
  styleUrls: ['./online-event.component.scss']
})
export class OnlineEventComponent implements OnInit {
  @Input() event!: UserSubmittedEvent;
  @Input() offset!: number[];

  constructor() { }

  ngOnInit(): void {
  }

  GetStyle() {
    return {
      position: 'absolute',
      left: `${this.offset[0]}px`,
      top: `${this.offset[1]}px`,
    };
  }
}

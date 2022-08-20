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
  isDialogVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  GetStyle() {
    if (this.isDialogVisible) {
      return {

      };
    } else {
      return {
        position: 'absolute',
        left: `${this.offset[0]}px`,
        top: `${this.offset[1]}px`,
        'z-index': `${Math.floor(window.innerWidth/2 - Math.abs(window.innerWidth/2 - this.offset[0]))}`
      };
    }
  }

  onClick() {
    this.isDialogVisible = !this.isDialogVisible;
  }
}

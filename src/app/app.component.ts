import { Component } from '@angular/core';

import { EventsService, PredefinedEvent } from './events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'g0v-timeline';
  minX: number = 0;
  maxX: number = 0;
  offsetX: number = 0;

  predefinedEvents: PredefinedEvent[] = [];

  constructor(private eventsService: EventsService) {
    this.predefinedEvents = eventsService.GetPredefinedEvents();
    this.maxX = window.innerWidth * 0.8;
    this.minX = -50;
  }

  GetStyle() {
    return {
      'background-color': 'gray',
      'width': '100%',
      'height': '400px',
    };
  }

  GetOffset(i: number): [number, number] {
    return [30 + i * 100 + this.offsetX , 30 + (i % 4) * 100];
  }

  IsVisible(i: number): boolean {
    const [x, y] = this.GetOffset(i);
    return this.minX <= x && x <= this.maxX;
  }

  OnScroll(event: any) {
    // event.stopPropagation();
    event.preventDefault();
    this.offsetX -= event.deltaX * 10;
    if (this.offsetX > 0) this.offsetX = 0;
    console.info(event);
  }
}

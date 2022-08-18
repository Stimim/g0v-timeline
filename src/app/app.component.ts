import { Component } from '@angular/core';

import { EventsService, PredefinedEvent } from './events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'g0v-timeline';
  minVisibleX: number = 0;
  maxVisibleX: number = 0;
  offsetX: number = 0;

  predefinedEvents: PredefinedEvent[] = [];
  predefinedEventsOffset: number[][] = [];

  onlineEvents: PredefinedEvent[] = [];

  constructor(private eventsService: EventsService) {
    this.predefinedEvents = eventsService.GetPredefinedEvents();
    this.maxVisibleX = window.innerWidth * 0.7;
    this.minVisibleX = window.innerWidth * 0.1;
    
    const rowHeight = window.innerHeight * 0.1;

    const startingOffset = window.innerWidth * 0.2;

    const rowMap = [0, 3, 1, 4, 2, 5];
    let minOffset = Infinity;

    for (let i = 0; i < this.predefinedEvents.length; i++) {
      const event = this.predefinedEvents[i];
      const eventDate = new Date(event.date);

      const offset = eventDate.getTime() / 86400000;
      const dx = offset * 10;
      const dy = 30 + (rowMap[i % rowMap.length] + 2) * rowHeight;
      this.predefinedEventsOffset[i] = [dx, dy];
      minOffset = Math.min(minOffset, dx);
    }

    minOffset -= startingOffset;

    for (let i = 0; i < this.predefinedEvents.length; i++) {
      this.predefinedEventsOffset[i][0] -= minOffset;
    }

    eventsService.GetOnlineEvents().subscribe((events: PredefinedEvent[]) => {
      this.onlineEvents = events;
    });

  }

  GetStyle() {
    return {
      width: '100%',
      height: `${window.innerHeight}px`,
    }
  }

  GetOffset(i: number): [number, number] {
    const dx = this.predefinedEventsOffset[i][0];
    const dy = this.predefinedEventsOffset[i][1];
    return [dx + this.offsetX, dy];
  }

  IsVisible(i: number): boolean {
    const [x, y] = this.GetOffset(i);
    return this.minVisibleX <= x && x <= this.maxVisibleX;
  }

  OnScroll(event: any) {
    event.stopPropagation();
    event.preventDefault();
    this.offsetX -= (event.deltaX + event.deltaY) * 2;
    if (this.offsetX > 0) this.offsetX = 0;
  }
}

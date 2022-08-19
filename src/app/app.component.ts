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
  maxOffsetX: number = 0;

  predefinedEvents: PredefinedEvent[] = [];
  predefinedEventsOffset: number[][] = [];
  links: number[][] = [];

  onlineEvents: PredefinedEvent[] = [];

  touchX? : number;

  constructor(private eventsService: EventsService) {
    this.predefinedEvents = eventsService.GetPredefinedEvents();

    this.predefinedEvents.sort((a, b) => {
      return a.date.localeCompare(b.date);
    });

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

    let adjustOffset = minOffset;
    const maxGap = (this.maxVisibleX - this.minVisibleX) * 0.8;
    const minGap = 50;

    this.predefinedEventsOffset[0][0] -= adjustOffset;
    for (let i = 1; i < this.predefinedEvents.length; i++) {
      this.predefinedEventsOffset[i][0] -= adjustOffset;
      const delta = this.predefinedEventsOffset[i][0] - this.predefinedEventsOffset[i - 1][0];
      if (delta > maxGap) {
        adjustOffset += delta - maxGap;
        this.predefinedEventsOffset[i][0] = this.predefinedEventsOffset[i - 1][0] + maxGap;
      } else if (delta <= minGap) {
        adjustOffset += minGap - delta;
        this.predefinedEventsOffset[i][0] = this.predefinedEventsOffset[i - 1][0] + minGap;
      }
    }

    this.maxOffsetX = this.predefinedEventsOffset[this.predefinedEvents.length - 1][0] - window.innerWidth / 3;

    const lastSeenTopicIndex: {[key: string]: number} = {};
    for (let i = 0; i < this.predefinedEvents.length; i++) {
      const event = this.predefinedEvents[i];
      if (!event.topic) continue;

      if (event.topic in lastSeenTopicIndex) {
        const j = lastSeenTopicIndex[event.topic];
        this.links.push([...this.predefinedEventsOffset[j], ...this.predefinedEventsOffset[i]]);
      }
      lastSeenTopicIndex[event.topic] = i;
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
    if (event.type === 'wheel' ||
        event.type === 'touchmove') {
      event.stopPropagation();
      event.preventDefault();
    }

    switch (event.type) {
      case 'wheel':
        this.offsetX -= (event.deltaX + event.deltaY) * 2;
        break;
      case 'touchstart':
      case 'touchmove':
        let currentTouchX = 0;
        for (let touch of event.touches) {
          currentTouchX += touch.clientX;
        }
        currentTouchX /= event.touches.length;

        if (this.touchX !== undefined &&
            Math.abs(this.touchX - currentTouchX) < 100) {
          this.offsetX += (currentTouchX - this.touchX);
        }
        this.touchX = currentTouchX;
        break;
      case 'touchend':
      case 'touchcancel':
        if (event.touches.length === 0) {
          this.touchX = undefined;
        }
        break;
    }

    if (this.offsetX > 0) this.offsetX = 0;
    if (this.offsetX < -this.maxOffsetX) this.offsetX = -this.maxOffsetX;
  }
}

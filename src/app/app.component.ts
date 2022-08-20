import { Component } from '@angular/core';

import { EventsService, PredefinedEvent, Event, UserSubmittedEvent } from './events.service';

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

  onlineEvents: UserSubmittedEvent[] = [];
  onlineEventsOffset: number[][] = [];

  touchX? : number;

  computeEventsOffset(events: Event[], rowMap: number[], rowHeight: number) {
    let offsets = [];

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const eventDate = new Date(event.date);

      const offset = eventDate.getTime() / 86400000;
      let dx = offset * 10;
      let dy = 30 + (rowMap[i % rowMap.length]) * rowHeight;

      dx += (Math.random() - 0.5) * 10;
      dy += (Math.random() - 0.5) * rowHeight / 2;
      if (dy < 30) dy = 30;

      offsets.push([dx, dy]);
    }

    return offsets;
  }

  constructor(private eventsService: EventsService) {
    this.predefinedEvents = eventsService.GetPredefinedEvents();

    this.predefinedEvents.sort((a, b) => {
      return a.date.localeCompare(b.date);
    });

    this.maxVisibleX = window.innerWidth * 0.7;
    this.minVisibleX = window.innerWidth * 0.1;

    const rowHeight = window.innerHeight / 12;
    const startingOffset = window.innerWidth * 0.2;

    const rowMap = [2, 5, 3, 6, 4, 7];
    let minOffset = Infinity;

    this.predefinedEventsOffset = this.computeEventsOffset(this.predefinedEvents, rowMap, rowHeight);
    for (let i = 0; i < this.predefinedEventsOffset.length; i++) {
      const dx = this.predefinedEventsOffset[i][0];
      minOffset = Math.min(minOffset, dx);
    }
    minOffset -= startingOffset;

    let adjustOffset = minOffset;

    this.predefinedEventsOffset[0][0] -= adjustOffset;
    for (let i = 1; i < this.predefinedEvents.length; i++) {
      this.predefinedEventsOffset[i][0] -= adjustOffset;
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

    this.predefinedEvents.reverse();
    this.predefinedEventsOffset.reverse();

    eventsService.GetOnlineEvents().subscribe((response: any) => {
      const events = response.results;
      this.onlineEvents = events;

      this.onlineEvents.sort((a, b) => {
        return a.date.localeCompare(b.date);
      });

      const rowMap = [0, 8, 1, 9];

      this.onlineEventsOffset = this.computeEventsOffset(
          events, rowMap, rowHeight);
      for (let i = 0; i < this.onlineEventsOffset.length; i++) {
        this.onlineEventsOffset[i][0] -= adjustOffset;
      }
      this.maxOffsetX = Math.max(
          this.maxOffsetX,
          this.onlineEventsOffset[this.onlineEventsOffset.length - 1][0] - window.innerWidth / 3);
      this.onlineEvents.reverse();
      this.onlineEventsOffset.reverse();
    });
  }

  GetStyle() {
    return {
      width: '100%',
      height: `${window.innerHeight}px`,
    }
  }

  GetOffset(i: number, online: boolean): [number, number] {
    if (online) {
      const dx = this.onlineEventsOffset[i][0];
      const dy = this.onlineEventsOffset[i][1];
      return [dx + this.offsetX, dy];
    }

    const dx = this.predefinedEventsOffset[i][0];
    const dy = this.predefinedEventsOffset[i][1];
    return [dx + this.offsetX, dy];
  }

  shouldDrawElement(i: number, online: boolean): boolean {
    const [x, y] = this.GetOffset(i, online);
    const width = window.innerWidth;
    return -(width / 2) <= x && x <= width * 1.5;
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

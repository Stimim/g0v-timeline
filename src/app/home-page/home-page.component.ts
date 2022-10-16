import { Component, OnInit } from '@angular/core';

import { BackendService, PredefinedEvent, Event, UserSubmittedEvent, UserEventObserverMessage } from '../backend.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  title = 'g0v-timeline';
  minVisibleX: number = 0;
  maxVisibleX: number = 0;
  offsetX: number = 0;
  maxOffsetX: number = 0;

  autoScrolling: boolean = false;

  predefinedEvents: PredefinedEvent[] = [];
  predefinedEventsOffset: number[][] = [];
  links: number[][] = [];

  userEvents: UserSubmittedEvent[] = [];
  userEventsOffset: number[][] = [];

  touchX?: number;
  rowHeight!: number;
  adjustOffset!: number;

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

  constructor(private backendService: BackendService) {
    this.predefinedEvents = backendService.GetPredefinedEvents();

    this.predefinedEvents.sort((a, b) => {
      return a.date.localeCompare(b.date);
    });

    this.maxVisibleX = window.innerWidth * 0.7;
    this.minVisibleX = window.innerWidth * 0.1;

    this.rowHeight = window.innerHeight / 12;
    const startingOffset = window.innerWidth * 0.2;

    const rowMap = [2, 5, 3, 6, 4, 7];
    let minOffset = Infinity;

    this.predefinedEventsOffset = this.computeEventsOffset(this.predefinedEvents, rowMap, this.rowHeight);
    for (let i = 0; i < this.predefinedEventsOffset.length; i++) {
      const dx = this.predefinedEventsOffset[i][0];
      minOffset = Math.min(minOffset, dx);
    }
    minOffset -= startingOffset;

    this.adjustOffset = minOffset;

    this.predefinedEventsOffset[0][0] -= this.adjustOffset;
    for (let i = 1; i < this.predefinedEvents.length; i++) {
      this.predefinedEventsOffset[i][0] -= this.adjustOffset;
    }

    this.maxOffsetX = this.predefinedEventsOffset[this.predefinedEvents.length - 1][0] - window.innerWidth / 3;

    const lastSeenTopicIndex: { [key: string]: number } = {};
    let topics: string[] = [];
    for (let i = 0; i < this.predefinedEvents.length; i++) {
      const event = this.predefinedEvents[i];
      if (!event.topic) continue;

      if (!(event.topic in topics)) {
        topics.push(event.topic);
      }
      if (event.topic in lastSeenTopicIndex) {
        const j = lastSeenTopicIndex[event.topic];
        this.links.push([...this.predefinedEventsOffset[j], ...this.predefinedEventsOffset[i],topics.indexOf(event.topic)]);
      }
      lastSeenTopicIndex[event.topic] = i;
    }

    this.predefinedEvents.reverse();
    this.predefinedEventsOffset.reverse();

    this.getUserEvents();
  }

  ngOnInit(): void {
  }

  getUserEvents() {
    this.backendService.SubscribeUserEvents(
      ({events, is_update}: UserEventObserverMessage) => {
        if (is_update && events.length === 0) return;

        this.userEvents.push(...events);

        this.userEvents.sort((a, b) => {
          return a.date.localeCompare(b.date);
        });

        const rowMap = [0, 8, 1, 9];

        this.userEventsOffset = this.computeEventsOffset(
            this.userEvents, rowMap, this.rowHeight);
        for (let i = 0; i < this.userEventsOffset.length; i++) {
          this.userEventsOffset[i][0] -= this.adjustOffset;
        }
        this.maxOffsetX = Math.max(
          this.maxOffsetX,
          this.userEventsOffset[this.userEventsOffset.length - 1][0] - window.innerWidth / 3);
        this.userEvents.reverse();
        this.userEventsOffset.reverse();
      });
  }

  GetStyle() {
    return {
      width: '100%',
      height: `${window.innerHeight}px`,
    }
  }

  GetOffset(i: number, is_user_event: boolean): [number, number] {
    if (is_user_event) {
      const dx = this.userEventsOffset[i][0];
      const dy = this.userEventsOffset[i][1];
      return [dx + this.offsetX, dy];
    }

    const dx = this.predefinedEventsOffset[i][0];
    const dy = this.predefinedEventsOffset[i][1];
    return [dx + this.offsetX, dy];
  }

  shouldDrawElement(i: number, is_user_event: boolean): boolean {
    const [x, y] = this.GetOffset(i, is_user_event);
    const width = window.innerWidth;
    return 0 <= x && x <= width * 0.8;
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

  previousTimeStamp?: number;
  speed: number = 20;
  rewinding = false;

  autoScrollOnce(timestamp: number) {
    if (!this.autoScrolling) return;

    if (this.previousTimeStamp === undefined) {
      this.previousTimeStamp = timestamp;
    }

    if (this.offsetX > 0) {
      // Done rewind, start another loop.  We don't need to get user event
      // again, the observer should keep receiving new events if it's
      // available.
      this.rewinding = false;
    } else if (this.offsetX < -this.maxOffsetX) {
      this.rewinding = true;
    }

    const dt = timestamp - this.previousTimeStamp;
    if (this.rewinding) {
      this.offsetX += dt * this.speed * 20 / 1000;
    } else {
      this.offsetX -= dt * this.speed / 1000;
    }
    this.previousTimeStamp = timestamp;

    requestAnimationFrame((t) => this.autoScrollOnce(t));
  }

  settingsModalEnabled: boolean = false;

  showSettings() {
    this.settingsModalEnabled = true;
  }

  startScrolling() {
    this.previousTimeStamp = undefined;
    this.rewinding = false;

    requestAnimationFrame((t) => this.autoScrollOnce(t));
  }

  onAutoScrollChanged(newValue: boolean) {
    this.autoScrolling = newValue;
    if (this.autoScrolling) {
      this.startScrolling();
    }
  }

  onSpeedChanged(newSpeed: number) {
    this.speed = newSpeed;
  }
}

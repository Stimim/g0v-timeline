import { Component } from '@angular/core';

import { EventsService, PredefinedEvent } from './events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'g0v-timeline';
  minX: number = 0;
  maxX: number = 0;
  offsetX: number = 0;

  predefinedEvents: PredefinedEvent[] = [];
  onlineEvents: PredefinedEvent[] = [];
  groupEvents: PredefinedEvent[][] = [];

  constructor(private eventsService: EventsService) {
    this.predefinedEvents = eventsService.GetPredefinedEvents();

    let groupEvents: PredefinedEvent[][] = [];
    this.predefinedEvents.forEach(event => {
      let eventDate: Date = new Date(event.date.replace("/", "-"));
      const checkInsert = (group: PredefinedEvent[], index: number) => {
        let currentDate = new Date(group[0].date.replace("/", "-"));
        if (currentDate.getFullYear() == eventDate.getFullYear() && currentDate.getMonth() == eventDate.getMonth()) {
          groupEvents[index].push(event);
          return false;
        } else if (currentDate.getFullYear() >= eventDate.getFullYear() && currentDate.getMonth() > eventDate.getMonth()) {
          groupEvents.splice(index, 0, [event]);
          return false;
        }
        return true;
      }
      if (groupEvents.every(checkInsert)) {
        groupEvents.push([event]);
      }
    });
    this.groupEvents = groupEvents;

    eventsService.GetOnlineEvents().subscribe((events: PredefinedEvent[]) => {
      this.onlineEvents = events;
    });
    this.maxX = window.innerWidth * 0.8;
    this.minX = -50;
  }

  GetStyle() {
    return { };
  }

  GetOffset(i: number): [number, number] {
    return [30 + i * 100 + this.offsetX, 30 + (i % 4) * 100];
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

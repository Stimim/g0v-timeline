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
    this.maxX = window.innerWidth * 0.3;
    this.minX = -50;
  }

  GetBlankStyle(i: number) {
    let delta = 0;
    if(i < this.groupEvents.length - 1) {
      let d1 = new Date(this.groupEvents[i].slice(-1)[0].date.replace("/", "-"));
      let d2 = new Date(this.groupEvents[i+1][0].date.replace("/", "-"));
      delta = d2.getTime()- d1.getTime();
    }
    return {
      'width': `${delta/(10 * 24 * 60 * 60 * 1000)}rem`
    };
  }

  GetStyle() {
    return {
      'width': '100%',
      'height': '400px',
    }
  }

  GetOffset(i: number): [number, number] {
    return [30 + i * 100 + this.offsetX, 30 + (i % 4) * 100];
  }

  GetOffsetByDate(date: string): [number, number] {
    return [Number(date.split("/")[2])*5,0];
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

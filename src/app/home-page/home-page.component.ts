import { AfterViewInit, Component, OnInit, ElementRef, ViewChild, } from '@angular/core';

import { BackendService, PredefinedEvent, Event, UserSubmittedEvent, UserEventObserverMessage } from '../backend.service';
import { TimelineCanvasComponent } from '../timeline-canvas/timeline-canvas.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  @ViewChild('actualCanvas') actualCanvas!: ElementRef<HTMLCanvasElement>;

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
    this.predefinedEvents = this.backendService.GetPredefinedEvents();

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

    this.initInMemoryCanvasForPredefinedEvents();
    this.initPredefinedEventsCanvas();

    this.getUserEvents();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.updateActualCanvas();
  }

  getUserEvents() {
    this.backendService.SubscribeUserEvents(
      ({events}: UserEventObserverMessage) => {
        this.userEvents = events;

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

  GetCanvasStyle() {
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
    this.updateActualCanvas();
  }

  inMemoryCanvasForPredefinedEvents?: HTMLCanvasElement = undefined;

  initInMemoryCanvasForPredefinedEvents() {
    if (this.inMemoryCanvasForPredefinedEvents !== undefined) return;

    this.inMemoryCanvasForPredefinedEvents = document.createElement('canvas');
    const width = this.maxVisibleX + this.maxOffsetX;
    const height = window.innerHeight;
    this.inMemoryCanvasForPredefinedEvents.style.width = `${width}px`;
    this.inMemoryCanvasForPredefinedEvents.style.height = `${height}px`;
    this.inMemoryCanvasForPredefinedEvents.width = width;
    this.inMemoryCanvasForPredefinedEvents.height = height;

    const ctx = this.inMemoryCanvasForPredefinedEvents.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    //ctx.fillStyle = 'black';
    //ctx.rect(
        //0, 0, this.inMemoryCanvasForPredefinedEvents.width, this.inMemoryCanvasForPredefinedEvents.height);
    //ctx.fill();

    const colors = ['FF56C2','59FFF6','FAF000','FF5720','7D55FF','EFA9DD'];
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 1]);
    for (let index = 0; index < this.links.length; index++) {
      const link = this.links[index];
      const color = '#' + colors[index % colors.length] + 'AA';
      const px = link[0];
      const py = link[1];
      const qx = link[2];
      const qy = link[3];

      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(px, py);
      ctx.lineTo(qx, qy);
      ctx.stroke();
    }

    for (let index in this.predefinedEventsOffset) {
      const offset = this.predefinedEventsOffset[index];
      const [offsetX, offsetY] = offset;

      ctx.beginPath();
      ctx.fillStyle = 'yellow';

      const points = [];
      for (let i = 0; i < 5; i++) {
        const x = offsetX + 10 * Math.cos(2 * Math.PI / 5 * i * 2);
        const y = offsetY + 10 * Math.sin(2 * Math.PI / 5 * i * 2);
        points.push([x, y]);
      }
      ctx.moveTo(points[0][0], points[0][1]);
      ctx.lineTo(points[1][0], points[1][1]);
      ctx.lineTo(points[2][0], points[2][1]);
      ctx.lineTo(points[3][0], points[3][1]);
      ctx.lineTo(points[4][0], points[4][1]);
      ctx.closePath();
      ctx.fill();
    }
  }

  predefinedEventsCanvas: HTMLCanvasElement[] = [];
  initPredefinedEventsCanvas() {
    for (let index = 0; index < this.predefinedEvents.length; index++) {
      const canvas = document.createElement('canvas');
      this.predefinedEventsCanvas.push(canvas);

      this.drawPredefinedEvent(canvas, this.predefinedEvents[index]);
    }
  }

  drawPredefinedEvent(canvas: HTMLCanvasElement, event: PredefinedEvent) {
    //const baseX = this.predefinedEventsOffset[index][0] + this.offsetX - 10;
    //const baseY = this.predefinedEventsOffset[index][1] - 10;
    const baseX = 1;
    const baseY = 1;
    const date = event.date;
    const subject = event.subject;
    const action = event.action;
    const object = event.object;

    const ctx: any = canvas.getContext('2d')!;

    ctx.font = '20px sans-serif';
    let maxWidth = 200;
    let dateWidth = ctx.measureText(date).width;
    let subjectWidth = 0;
    let actionWidth = 0;
    let objectWidth = 0;

    maxWidth = Math.max(maxWidth, dateWidth);
    if (subject) {
      subjectWidth = ctx.measureText(subject).width;
      maxWidth = Math.max(maxWidth, subjectWidth);
    }
    if (action) {
      actionWidth = ctx.measureText(action).width;
      maxWidth = Math.max(maxWidth, actionWidth);
    }
    if (object) {
      objectWidth = ctx.measureText(object).width;
      maxWidth = Math.max(maxWidth, objectWidth);
    }

    canvas.width = maxWidth + 15;
    canvas.height = 125;

    ctx.beginPath();
    ctx.roundRect(baseX, baseY + 20, maxWidth + 10, 100, [5, 10]);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'black';
    ctx.fill();

    ctx.fillStyle = '#FF56C2';
    ctx.beginPath();
    ctx.roundRect(baseX, baseY + 3, dateWidth + 10, 20, [5, 10]);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '20px sans-serif';
    ctx.fillText(date, baseX + 5, baseY + 20);

    if (subject) {
      ctx.fillStyle = 'white';
      ctx.font = '20px sans-serif';
      ctx.fillText(subject, baseX, baseY + 40);
    }
    if (action) {
      ctx.fillStyle = '#59FFF6';
      ctx.font = '20px sans-serif';
      ctx.fillText(action, baseX, baseY + 60);
    }
    if (object) {
      ctx.fillStyle = '#59FFF6';
      ctx.font = '20px sans-serif';
      ctx.fillText(object, baseX, baseY + 80);
    }
  }

  updateActualCanvas() {
    const actualCanvas = this.actualCanvas.nativeElement;
    const ctx = actualCanvas.getContext('2d')!;
    actualCanvas.width = window.innerWidth;
    actualCanvas.height = window.innerHeight;
    const thisOffsetX = Math.floor(this.offsetX);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, actualCanvas.width, actualCanvas.height);

    ctx.drawImage(
        this.inMemoryCanvasForPredefinedEvents!,
        -this.offsetX, 0, window.innerWidth, window.innerHeight,
        0, 0, window.innerWidth, window.innerHeight);

    const w = window.innerWidth;
    let eventsToDraw = [];
    for (let index = 0; index < this.predefinedEvents.length; index++) {
      if (this.shouldDrawElement(index, false)) {
        let [offsetX, offsetY] = this.predefinedEventsOffset[index];
        offsetX += thisOffsetX;
        const z = Math.floor(w * 2 - Math.abs(w / 2 - offsetX) + offsetY);
        eventsToDraw.push([index, z]);
      }
    }

    eventsToDraw.sort(([i, z1], [j, z2]) => {
      return z1 - z2;
    });

    for (let [index, z] of eventsToDraw) {
      const canvas = this.predefinedEventsCanvas[index];
      const [offsetX, offsetY] = this.predefinedEventsOffset[index];
      let opacity = Math.min(1, (w * 0.8 - (offsetX + thisOffsetX)) / 150);
      ctx.globalAlpha = opacity;
      ctx.drawImage(canvas,
                    0, 0, canvas.width, canvas.height,
                    offsetX + thisOffsetX - 10, offsetY - 15, canvas.width, canvas.height);
    }
    ctx.globalAlpha = 1;
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
    if(dt > 16) {
      if (this.rewinding) {
        this.offsetX += dt * this.speed * 20 / 1000;
      } else {
        this.offsetX -= dt * this.speed / 1000;
      }
      this.previousTimeStamp = timestamp;
      this.updateActualCanvas();
    }
  }

  settingsModalEnabled: boolean = false;

  showSettings() {
    this.settingsModalEnabled = true;
  }

  startScrolling() {
    this.previousTimeStamp = undefined;
    this.rewinding = false;

    const draw = (t: number) => {
      this.autoScrollOnce(t);
      if (this.autoScrolling) requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
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

  gotoHereAmI() {
    window.open('here-am-i', '_blank')!.focus();
  }
}

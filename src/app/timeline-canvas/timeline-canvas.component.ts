import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-timeline-canvas',
  templateUrl: './timeline-canvas.component.svg',
  styleUrls: ['./timeline-canvas.component.css']
})
export class TimelineCanvasComponent implements OnInit {

  @Input() offsetX!: number;
  @Input() style!: object;
  @Input() predefinedEventsOffset!: number[][];
  @Input() minVisibleX!: number;
  @Input() maxVisibleX!: number;

  constructor() { }

  ngOnInit(): void {
  }

  getFillColor() {
    const a = (Math.ceil(Math.abs(this.offsetX) / 10)) % 128;
    const b = Math.abs(a - 64);

    return `rgb(${b}, ${b}, ${b})`;
  }

  getStarPoints(offset: number[], index: number) : string {
    const offsetX = offset[0] + this.offsetX;
    const offsetY = offset[1];

    const points = [];

    for (let i = 0; i < 5; i++) {
      const x = offsetX + 10 * Math.cos(2 * Math.PI / 5 * i * 2 + index * Math.PI / 3);
      const y = offsetY + 10 * Math.sin(2 * Math.PI / 5 * i * 2 + index * Math.PI / 3);
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  }

  IsVisible(offset: number[]) : boolean {
    const dx = offset[0] + this.offsetX;
    return dx < this.minVisibleX || dx > this.maxVisibleX;
  }

}

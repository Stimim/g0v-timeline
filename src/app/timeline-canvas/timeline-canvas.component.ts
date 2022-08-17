import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-timeline-canvas',
  templateUrl: './timeline-canvas.component.svg',
  styleUrls: ['./timeline-canvas.component.css']
})
export class TimelineCanvasComponent implements OnInit {

  @Input() offsetX!: number;
  @Input() style!: object;
  @Input() predefinedEvents!: object[];

  constructor() { }

  ngOnInit(): void {
  }

  getFillColor() {
    const a = (Math.ceil(Math.abs(this.offsetX) / 10)) % 255;
    const b = Math.abs(a - 128);

    return `rgb(${b}, ${b}, ${b})`;
  }

  getStarPoints(event: object, index: number) : string {
    const offsetX = 30 + index * 100 + this.offsetX;
    const offsetY = 30 + (index % 4) * 100;

    const points = [];

    for (let i = 0; i < 5; i++) {
      const x = offsetX + 10 * Math.cos(2 * Math.PI / 5 * i * 2 + index * Math.PI / 3);
      const y = offsetY + 10 * Math.sin(2 * Math.PI / 5 * i * 2 + index * Math.PI / 3);
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  }

}

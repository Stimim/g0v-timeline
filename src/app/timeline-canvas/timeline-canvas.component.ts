import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-timeline-canvas',
  templateUrl: './timeline-canvas.component.svg',
  styleUrls: ['./timeline-canvas.component.scss']
})
export class TimelineCanvasComponent implements OnInit {

  @Input() offsetX!: number;
  @Input() style!: object;
  @Input() predefinedEventsOffset!: number[][];
  @Input() userEventsOffset!: number[][];
  @Input() minVisibleX!: number;
  @Input() maxVisibleX!: number;
  @Input() links!: number[][];  // [ [p.x, p.y, q.x, q.y] ]

  constructor() { }

  ngOnInit(): void {
  }

  getStrokeColor(i:number) {
    const colors = ['FF56C2','59FFF6','FAF000','FF5720','7D55FF','EFA9DD'];
    return '#' + colors[i%colors.length] + "AA";
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

  getLinkPath(link: number[]) : string {
    const px = link[0] + this.offsetX;
    const py = link[1];
    const qx = link[2] + this.offsetX;
    const qy = link[3];

    return `M ${px} ${py} L ${qx} ${qy}`
  }

}

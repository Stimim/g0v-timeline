import { Component, OnInit, ViewChild, ElementRef, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {
  @Input() enable: boolean = true;
  @Output() enableChange = new EventEmitter<boolean>();

  @Output() speedChangedEvent = new EventEmitter<number>();
  @Output() autoScrollChangedEvent = new EventEmitter<boolean>();

  @ViewChild('modal') modalElement!: ElementRef;

  speed: number = 20;

  constructor() { }

  ngOnInit(): void {
  }

  onSpeedChanged() {
    this.speedChangedEvent.emit(this.speed);
  }

  onAutoScrollChanged(event: any) {
    this.autoScrollChangedEvent.emit(event.checked);
  }

  onClose() {
    this.enableChange.emit(false);
  }
}

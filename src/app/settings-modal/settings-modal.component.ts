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
  autoScrollEnabled = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSpeedChanged(event: any) {
    this.speed = event.value;
    this.speedChangedEvent.emit(this.speed);
  }

  onAutoScrollChanged() {
    this.autoScrollChangedEvent.emit(this.autoScrollEnabled);
  }

  onClose() {
    this.enableChange.emit(false);
  }
}

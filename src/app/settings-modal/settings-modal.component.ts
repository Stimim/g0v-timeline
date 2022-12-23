import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss']
})
export class SettingsModalComponent implements OnInit {
  @Input() enable: boolean = true;
  @Output() enableChange = new EventEmitter<boolean>();

  @Output() autoScrollChangedEvent = new EventEmitter<boolean>();
  @Output() showNotificationsChangedEvent = new EventEmitter<boolean>();
  @Output() speedChangedEvent = new EventEmitter<number>();

  autoScrollEnabled = false;
  showNotificationsEnabled = false;
  speed: number = 20;

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

  onShowNotificationsChanged() {
    this.showNotificationsChangedEvent.emit(this.showNotificationsEnabled);
  }

  onClose() {
    this.enableChange.emit(false);
  }
}

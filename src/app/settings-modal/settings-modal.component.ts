import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';


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

  settingsForm = new FormGroup({
    autoScrollEnabled: new FormControl(false),
    selectedLanguage: new FormControl('zh'),
    showNotificationsEnabled: new FormControl(false),
    speed: new FormControl(20),
  });

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }

  onSpeedChanged() {
    this.speedChangedEvent.emit(this.settingsForm.value.speed!);
  }

  onAutoScrollChanged() {
    this.autoScrollChangedEvent.emit(this.settingsForm.value.autoScrollEnabled!);
  }

  onShowNotificationsChanged() {
    this.showNotificationsChangedEvent.emit(this.settingsForm.value.showNotificationsEnabled!);
  }

  onSelectedLanguageChanged() {
    console.debug('Changing language to:', this.settingsForm.value.selectedLanguage!);
    this.translate.use(this.settingsForm.value.selectedLanguage!);
  }

  onClose() {
    this.enableChange.emit(false);
  }
}

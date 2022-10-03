import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import { EventBus } from '../event-bus.service';
import { UserSubmittedEvent, BackendService } from '../backend.service';

function getToday() {
  const now = new Date();
  const year = `${now.getFullYear()}`;
  const month = `0${now.getMonth() + 1}`.slice(-2);
  const date = `0${now.getDate()}`.slice(-2);
  return `${year}-${month}-${date}`;
}

@Component({
  selector: 'app-upload-event',
  templateUrl: './upload-event.component.html',
  styleUrls: ['./upload-event.component.scss']
})
export class UploadEventComponent implements OnInit {

  form = new FormGroup({
    date: new FormControl(getToday()),
    subject: new FormControl('沒有人'),
    description: new FormControl(),
  });

  constructor(
    private backendService: BackendService,
    private eventBus: EventBus,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onClick() {
    const event = this.getEventFromFormValue();
    if (event === null) return;

    this.backendService.SubmitOneOnline(event).subscribe((result: any) => {
      const message = result.message;
      this.snackBar.open(message, 'OK');
    });
  }

  showPreview() {
    const event = this.getEventFromFormValue();
    if (event === null) return;

    this.eventBus.SetUserEvent(event);
  }

  getEventFromFormValue(): UserSubmittedEvent | null {
    if (this.form.invalid) {
      return null;
    }

    const event: UserSubmittedEvent = {
      date: this.form.value.date!,
      subject: this.form.value.subject!,
      description: this.form.value.description!,
    };
    return event;
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-take-down-event',
  templateUrl: './take-down-event.component.html',
  styleUrls: ['./take-down-event.component.scss']
})
export class TakeDownEventComponent implements OnInit {

  form = new FormGroup({
    event_id: new FormControl(),
    secret: new FormControl(),
  });

  constructor(
    private backendService: BackendService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
  }

  onClick() {
    if (this.form.invalid) return;

    this.backendService.TakeDownEvent(
      this.form.value.event_id!, this.form.value.secret!).subscribe(
        ({message}: any) => {
          this.snackBar.open(message, 'OK');
        },
        ({error}) => {
          this.snackBar.open(`error: ${error.message}`, 'OK');
        },
      );
  }
}

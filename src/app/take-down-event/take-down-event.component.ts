import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-take-down-event',
  templateUrl: './take-down-event.component.html',
  styleUrls: ['./take-down-event.component.scss']
})
export class TakeDownEventComponent implements OnInit {
  @ViewChild('googleLoginButton') googleLoginButton!: ElementRef<HTMLDivElement>;

  form = new FormGroup({
    event_id: new FormControl(),
  });

  constructor(
    private backendService: BackendService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      console.log('Google One Tap library loaded.');

      // @ts-ignore
      google.accounts.id.initialize({
        client_id: '1051382277094-rpj78qldqe8vi8fueudei8gho2geeqoj.apps.googleusercontent.com',
        callback: this.handleCredentialResponse.bind(this),
        auto_select: true,
        cancel_on_tap_outside: false
      });

      this.renderGoogleLoginButton();
    }
  }

  renderGoogleLoginButton() {
    // @ts-ignore
    google.accounts.id.renderButton(
      this.googleLoginButton.nativeElement,
      {
        'type': 'standard',
        'text': 'continue_with',
      }
    );
  }

  onClick() {
    if (this.form.invalid) return;

    // @ts-ignore
    google.accounts.id.prompt((notification: PromptMomentNotification) => {
      const hintUser = () => {
        this.snackBar.open('You need to sign in with a Google account to continue.', 'OK');
      };
      switch (notification.getMomentType()) {
        case 'display':
          if (notification.isNotDisplayed()) {
            hintUser();
          }
          break;
        case 'skipped':
          hintUser();
          break;
        case 'dismissed':
          if (notification.getDismissedReason() != 'credential_returned') {
            hintUser();
          }
          break;
      }
    });
  }

  handleCredentialResponse(response: CredentialResponse) {
    if (this.form.invalid) return;

    console.log(response.credential);
    let decodedToken: any | null = null;
    try {
      decodedToken = JSON.parse(atob(response?.credential.split('.')[1]));
    } catch (e) {
      console.error('Error while trying to decode token', e);
      return;
    }

    this.backendService.TakeDownEvent(
      this.form.value.event_id!,
      response.credential
    ).subscribe(
        ({message}: any) => {
          this.snackBar.open(message, 'OK');
        },
        ({error}) => {
          this.snackBar.open(`error: ${error.message || error}`, 'OK');
        },
      );
  }
}

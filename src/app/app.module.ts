import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { TimelineCanvasComponent } from './timeline-canvas/timeline-canvas.component';
import { UserEventComponent } from './user-event/user-event.component';
import { EventModalComponent } from './event-modal/event-modal.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadEventComponent } from './submit-user-event/submit-user-event.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NotificationAreaComponent } from './notification-area/notification-area.component';
import { TakeDownEventComponent } from './take-down-event/take-down-event.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    TimelineCanvasComponent,
    UserEventComponent,
    EventModalComponent,
    SettingsModalComponent,
    UploadEventComponent,
    HomePageComponent,
    NotificationAreaComponent,
    TakeDownEventComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    RecaptchaV3Module,
    RouterModule.forRoot([
      {
        path: '',
        component: HomePageComponent,
        title: 'g0v Timeline',
      },
      {
        path: 'here-am-i',
        component: UploadEventComponent,
        title: 'g0v Timeline - 輸入你的關鍵字',
      },
      {
        path: 'take-down-event',
        component: TakeDownEventComponent,
        title: 'g0v Timeline - Take Down Event',
      },
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6Lf6LlAiAAAAADnjjM8tVhqagrb7HKO5t-R9QoA4' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { TimelineCanvasComponent } from './timeline-canvas/timeline-canvas.component';
import { OnlineEventComponent } from './online-event/online-event.component';
import { EventModalComponent } from './event-modal/event-modal.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadEventComponent } from './upload-event/upload-event.component';
import { HomePageComponent } from './home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    TimelineCanvasComponent,
    OnlineEventComponent,
    EventModalComponent,
    SettingsModalComponent,
    UploadEventComponent,
    HomePageComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatSnackBarModule,
    RouterModule.forRoot([
      {path: '', component: HomePageComponent},
      {path: 'here-am-i', component: UploadEventComponent},
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

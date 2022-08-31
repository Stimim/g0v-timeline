import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';

import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { TimelineCanvasComponent } from './timeline-canvas/timeline-canvas.component';
import { OnlineEventComponent } from './online-event/online-event.component';
import { EventModalComponent } from './event-modal/event-modal.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    TimelineCanvasComponent,
    OnlineEventComponent,
    EventModalComponent,
    SettingsModalComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSliderModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

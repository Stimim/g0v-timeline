import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { TimelineCanvasComponent } from './timeline-canvas/timeline-canvas.component';
import { OnlineEventComponent } from './online-event/online-event.component';
import { EventModalComponent } from './event-modal/event-modal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    TimelineCanvasComponent,
    OnlineEventComponent,
    EventModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

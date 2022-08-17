import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EventComponent } from './event/event.component';
import { TimelineCanvasComponent } from './timeline-canvas/timeline-canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    EventComponent,
    TimelineCanvasComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

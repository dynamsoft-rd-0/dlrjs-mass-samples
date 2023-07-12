import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { VideoRecognizerComponent } from './video-recognizer/video-recognizer.component';
import { ImageRecognizerComponent } from './image-recognizer/image-recognizer.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';

@NgModule({
  declarations: [
    AppComponent,
    VideoRecognizerComponent,
    ImageRecognizerComponent,
    HelloWorldComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

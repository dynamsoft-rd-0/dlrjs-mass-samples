import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRecognizerComponent } from './video-recognizer.component';

describe('VideoRecognizerComponent', () => {
  let component: VideoRecognizerComponent;
  let fixture: ComponentFixture<VideoRecognizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoRecognizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoRecognizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRecognizerComponent } from './image-recognizer.component';

describe('ImageRecognizerComponent', () => {
  let component: ImageRecognizerComponent;
  let fixture: ComponentFixture<ImageRecognizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageRecognizerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageRecognizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

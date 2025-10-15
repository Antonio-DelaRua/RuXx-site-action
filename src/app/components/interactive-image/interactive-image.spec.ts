import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractiveImage } from './interactive-image';

describe('InteractiveImage', () => {
  let component: InteractiveImage;
  let fixture: ComponentFixture<InteractiveImage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractiveImage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractiveImage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

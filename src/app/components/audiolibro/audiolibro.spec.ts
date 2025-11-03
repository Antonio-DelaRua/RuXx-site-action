import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Audiolibro } from './audiolibro';

describe('Audiolibro', () => {
  let component: Audiolibro;
  let fixture: ComponentFixture<Audiolibro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Audiolibro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Audiolibro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

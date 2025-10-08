import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Treeskills } from './treeskills';

describe('Treeskills', () => {
  let component: Treeskills;
  let fixture: ComponentFixture<Treeskills>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Treeskills]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Treeskills);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

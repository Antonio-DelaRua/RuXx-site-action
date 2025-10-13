import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rutalearning } from './rutalearning';

describe('Rutalearning', () => {
  let component: Rutalearning;
  let fixture: ComponentFixture<Rutalearning>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Rutalearning]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rutalearning);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

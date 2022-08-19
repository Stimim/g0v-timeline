import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineEventComponent } from './online-event.component';

describe('OnlineEventComponent', () => {
  let component: OnlineEventComponent;
  let fixture: ComponentFixture<OnlineEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

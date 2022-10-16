import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeDownEventComponent } from './take-down-event.component';

describe('TakeDownEventComponent', () => {
  let component: TakeDownEventComponent;
  let fixture: ComponentFixture<TakeDownEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TakeDownEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakeDownEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

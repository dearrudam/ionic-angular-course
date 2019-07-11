import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferItemComponent } from './offer-item.component';
import { newSamplePlace } from '../../place.model';

describe('OfferItemComponent', () => {
  let component: OfferItemComponent;
  let fixture: ComponentFixture<OfferItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferItemComponent);
    component = fixture.componentInstance;
    component.offer = newSamplePlace();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOfferPage } from './edit-offer.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  newSamplePlace } from '../../place.model';


describe('EditOfferPage', () => {
  let component: EditOfferPage;
  let fixture: ComponentFixture<EditOfferPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditOfferPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditOfferPage);
    component = fixture.componentInstance;
    component.editPlace(newSamplePlace());
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBookingComponent } from './create-booking.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('CreateBookingComponent', () => {
  let component: CreateBookingComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      // tslint:disable-next-line: no-use-before-declare
      declarations: [ CreateBookingComponent, TestHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, IonicModule.forRoot(),
        RouterTestingModule],
    })
    .compileComponents();
  }));


  beforeEach(() => {
  // tslint:disable-next-line: no-use-before-declare
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
    component = testHostComponent.createBookingComponent;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  @Component({
    selector: `host-component`,
    template: `<app-create-booking></app-create-booking>`
  })
  class TestHostComponent {
    @ViewChild(CreateBookingComponent)
    public createBookingComponent: CreateBookingComponent;
  }
});

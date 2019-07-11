import { TestBed } from '@angular/core/testing';

import { PlacesService } from './places.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PlacesService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientModule,
        HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: PlacesService = TestBed.get(PlacesService);
    expect(service).toBeTruthy();
  });
});

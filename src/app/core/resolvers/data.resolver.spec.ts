import { TestBed } from '@angular/core/testing';

import { DataResolver } from './data.resolver';

describe('DataResolver', () => {
  let resolver: DataResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(DataResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});

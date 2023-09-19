import { TestBed } from '@angular/core/testing';

import { V2AccessGuardGuard } from './v2-access-guard.guard';

describe('V2AccessGuardGuard', () => {
  let guard: V2AccessGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(V2AccessGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

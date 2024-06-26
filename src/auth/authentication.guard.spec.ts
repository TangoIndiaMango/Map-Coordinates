import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canHaveAccess } from './authentication.guard';

describe('authenticationGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => canHaveAccess(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});

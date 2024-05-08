import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Location, LocationService } from '../services/location.service';
import { NotificationService } from '../services/notification.service';

@Injectable({
  providedIn: 'root',
})
class UserLocation {
  constructor(private locationService: LocationService) {
    this.userLocation = this.locationService.getLocation()[0];
  }

  userLocation: Location;

  get hasValidLocation(): boolean {
    return (
      this.userLocation &&
      this.userLocation.lat !== 0 &&
      this.userLocation.lng !== 0
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(
    private userLocation: UserLocation,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(): boolean {
    if (this.userLocation.hasValidLocation) {
      return true;
    } else {
      this.notificationService.errorMessage(
        'Error',
        'Please add your location'
      );
      this.router.navigate(['/home']).then(() => window.location.reload());
      return false;
    }
  }
}

export const canHaveAccess: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(PermissionService).canActivate();
};

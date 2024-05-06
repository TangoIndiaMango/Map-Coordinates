import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LogginService } from './logging.service';
import { NotificationService } from './notification.service';

export type Location = {
  lat: number;
  lng: number;
};

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  location: Location[] = [];
  // userLocation: Location = { lat: 0, lng: 0 }
  private flag = new BehaviorSubject(false);
  flag$ = this.flag.asObservable();

  constructor(
    private loggingService: LogginService,
    private notificationService: NotificationService
  ) {
    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.storeLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          this.flag.next(true);
        },
        (error) => {
          this.loggingService.logError(error.message);
        }
      );
    } else {
      this.notificationService.infoMessage(
        'Geo Info',
        "Can't obtain Geolocation, Geolocation not suppported"
      );
    }
  }

  storeLocation(location: Location) {
    this.location.push(location);
  }

  getLocation() {
    return this.location;
  }

  clearLocation() {
    this.location = [];
  }

  clearLastLocation() {
    this.location.pop();
  }
}

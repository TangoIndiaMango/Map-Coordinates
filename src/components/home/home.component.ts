import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as Leaflet from 'leaflet';
import { ToastModule } from 'primeng/toast';
import { AreaService } from '../../services/area.service';
import { Location, LocationService } from '../../services/location.service';
import { MapService } from '../../services/map.service';
import { NotificationService } from '../../services/notification.service';
import { UserDialogComponent } from './user_location/user_cord_dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ToastModule, LeafletModule, RouterLink, UserDialogComponent, CommonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  userLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };
  map!: Leaflet.Map;
  loading: boolean = true;
  isActive: boolean = false;
  newCoordinates: any = null;
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLElement>;
  constructor(
    private notificationService: NotificationService,
    public locationService: LocationService,
    private mapService: MapService,
    private areaService: AreaService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = this.mapService.initMap('map');
    if (this.map) {
      this.newCoordinates = this.locationService.getLocation();

      if (this.newCoordinates && this.newCoordinates.length > 0) {
        this.renderMarkers(null, this.newCoordinates);
      } else {
        if (this.locationService.flag$) {
          this.locationService.flag$.subscribe((flag) => {
            if (flag) {
              this.loading = false;
              this.userLocation = this.locationService.getLocation()[0];
              this.renderMarkers(this.userLocation, null);
            }
          });
        }
      }
    }
  }

  renderMarkers(
    userLocation: Location | null,
    newCoordinate: Location[] | null
  ) {
    if (userLocation) {
      this.mapService.addMarker(
        userLocation.lat,
        userLocation.lng,
        'Your Location'
      );
      this.map.setView(userLocation, 12);
    }

    if (newCoordinate && newCoordinate.length > 1) {
      const coordsWithoutUser = newCoordinate.slice(1);
      this.mapService.addToMarkers(coordsWithoutUser);
    }
  }

  updateLocation(location: Location) {
    this.resetMap();
    // this.userLocation = location;
    this.locationService.storeLocation(location);
    this.renderMarkers(location, null);
  }

  pickCoordinates() {
    this.isActive = !this.isActive;
    if (this.map) {
      this.map.on('click', (event: Leaflet.LeafletMouseEvent) =>
        this.mapService.handleMapClick(event)
      );
    }
  }

  clearLastCoordinate() {
    this.mapService.clearLastCoordinate();
    this.locationService.clearLastLocation();
  }

  calculateEnclosedArea() {
    if (this.mapService.getMarkers().length < 3) {
      this.notificationService.infoMessage(
        'Info',
        'Please add at least 3 markers to calculate enclosed area.'
      );
      return;
    }
    this.areaService.setMarkerData(this.mapService.getMarkers());
    this.router.navigate(['/area']);
  }

  resetMap() {
    this.isActive = false;
    this.mapService.clearMarkers();
    this.locationService.clearLocation();
  }

  panToNextMarker() {
    const markers = this.areaService.getMarkerData();
    console.log(markers);
    if (markers.length <= 1) {
      this.notificationService.infoMessage(
        'Info',
        'No more markers to pan to.'
      );
      return;
    }
    const nextMarker = markers.shift();
    this.map.panTo(nextMarker);
  }
}

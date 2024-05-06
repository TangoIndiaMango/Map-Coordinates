import { Injectable } from '@angular/core';
import { Location } from './location.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  markerData: any[] = [];
  constructor() {}

  addMarker(lat: number, lng: number) {
    this.markerData.push({ lat: lat, lng: lng });
  }

  setMarkerData(markers: any[]) {
    this.markerData = markers.map((marker) => ({
      lat: marker.getLatLng().lat,
      lng: marker.getLatLng().lng,
      title: marker.options.title,
    }));
  }

  getMarkerData() {
    return this.markerData;
  }
}

import { Injectable } from '@angular/core';
import * as Leaflet from 'leaflet';
import { formatData } from '../../utils/helpers';
import { AreaService } from './area.service';

type Location = {
  lat: number,
  lng: number
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map!: Leaflet.Map;
  markers: Leaflet.Marker[] | any = [];

  constructor(private areaService: AreaService) { }

  getLayers = (): Leaflet.Layer[] => {
    return [
      new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        minZoom: 4,
        attribution: '&copy; OpenStreetMap contributions'
      } as Leaflet.TileLayerOptions),

    ] as Leaflet.Layer[]
  }

  options: Leaflet.MapOptions = {
    layers: this.getLayers(),
    zoom: 12,
    center: Leaflet.latLng(6.5243793, 3.3792057),
    trackResize: true,
    zoomControl: true,
    attributionControl: false,
    scrollWheelZoom: false,
  };

  initMap(mapElement: string): Leaflet.Map {
    this.map = Leaflet.map(mapElement, this.options);
    this.map.addLayer(this.getLayers()[0]);
    return this.map
  }

  initMaptwo(mapElement: HTMLElement): Leaflet.Map {
    this.map = Leaflet.map(mapElement).setView([43.530147, 16.488932], 15);
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    return this.map
  }

  addMarker(latitude: number, longitude: number, title: string): void {
    const marker = Leaflet.marker([latitude, longitude], {
      icon: new Leaflet.Icon({
        iconSize: [35, 40],
        iconAnchor: [20, 10],
        iconUrl: 'assets/pin.png'
      }),
      title: title
    }).addTo(this.map).bindPopup(title).openPopup();
    this.markers.push(marker);

    // Limit the number of markers to 5
    if (this.markers.length > 5) {
      const removedMarker = this.markers.shift();
      if (removedMarker) {
        this.map.removeLayer(removedMarker);
      }
    }
  }

  clearMarkers(): void {
    this.markers.forEach((marker: Leaflet.Marker) => marker.remove());
    this.markers = [];
    this.map.setView([0, 0], 4);
  }

  getMarkers(): Location[] {
    return this.markers
  }

  handleMapClick(event: Leaflet.LeafletMouseEvent) {
    const { lat, lng } = event.latlng
    const title = `Marker ${this.markers.length}`
    this.areaService.addMarker(lat, lng)
    this.addMarker(lat, lng, title)
  }

  clearLastCoordinate() {
    if (this.markers.length > 0) {
      const removedMarker = this.markers.pop();
      if (removedMarker) {
        this.map.removeLayer(removedMarker);
      }
    }
  }

  addToMarkers(newCoordinate: Location[]): void {
    console.log(newCoordinate);
    newCoordinate.flatMap((coord:any) =>
      coord.map((data: Location, index: number) => {
        const {lat, lng} = data
        const title = `Marker ${index + 1}`;
        this.addMarker(lat, lng, title);
      })
    );
    const firstData = formatData(newCoordinate as any);
    this.map.setView(firstData as Leaflet.LatLngExpression , 14)
  }
}

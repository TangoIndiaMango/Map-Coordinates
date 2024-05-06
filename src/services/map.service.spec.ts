import { TestBed } from '@angular/core/testing';
import * as Leaflet from 'leaflet';
import { MapService } from './map.service';
import { AreaService } from './area.service';

describe('MapService', () => {
  let service: MapService;
  let areaServiceMock: jasmine.SpyObj<AreaService>;

  beforeEach(() => {
    const mapElementMock = document.createElement('div');
    areaServiceMock = jasmine.createSpyObj('AreaService', [
      'setMarkerData',
      'addMarker',
    ]);

    TestBed.configureTestingModule({
      providers: [
        MapService,
        { provide: AreaService, useValue: areaServiceMock },
      ],
    });
    service = TestBed.inject(MapService);
    service.initMaptwo(mapElementMock);
  });

  afterEach(() => {
    service.clearMarkers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a marker to the map', () => {
    const initalMarkersLength = service.getMarkers().length;
    service.addMarker(0, 0, 'Test Marker');
    const markers = service.getMarkers();
    expect(markers.length).toEqual(initalMarkersLength + 1);
    expect(markers.length).toBeGreaterThan(initalMarkersLength);
  });

  it('should limit the number of markers to 5', () => {
    for (let i = 0; i < 6; i++) {
      service.addMarker(i, i, `Marker${i}`);
    }
    const markers = service.getMarkers();
    expect(markers.length).toEqual(5);
    expect(markers.length).toBeLessThan(6);
  });

  it('should clear all markers from the map', () => {
    service.addMarker(0, 0, 'Test Marker');
    service.clearMarkers();
    const markers = service.getMarkers();
    expect(markers.length).toEqual(0);
    expect(markers.length).toBeLessThan(1);
  })

  it('should handle map click event and add a marker', () => {
    const event = {latlng: {lat: 0, lng:0}} as Leaflet.LeafletMouseEvent;
    service.handleMapClick(event);
    const markers = service.getMarkers();
    expect(markers.length).toEqual(1);
    expect(areaServiceMock.addMarker).toHaveBeenCalledWith(0, 0);
  })

  it ('should clear last added marker from the map', () => {
    service.addMarker(0, 0, 'Test Marker');
    service.clearLastCoordinate();
    const markers = service.getMarkers();
    expect(markers.length).toEqual(0);
    expect(markers.length).toBeLessThan(1);
  })
});

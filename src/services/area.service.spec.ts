import { TestBed } from '@angular/core/testing';
import { AreaService } from './area.service';

describe('AreaService', () => {
  let service: AreaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set marker data correctly', () => {
    const mockMarkers = [
      { getLatLng: () => ({ lat: 40.7128, lng: -74.0060 }), options: { title: 'Marker 1' } },
      { getLatLng: () => ({ lat: 40.7129, lng: -74.0061 }), options: { title: 'Marker 2' } }
    ];
    service.setMarkerData(mockMarkers);
    const markerData = service.getMarkerData();
    expect(markerData.length).toBe(2);
    expect(markerData[0]).toEqual({ lat: 40.7128, lng: -74.0060, title: 'Marker 1' });
    expect(markerData[1]).toEqual({ lat: 40.7129, lng: -74.0061, title: 'Marker 2' });
  });
});

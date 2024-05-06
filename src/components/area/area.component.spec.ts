import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AreaComponent } from './area.component';
import { AreaService } from '../../services/area.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/localStorage.service';

describe('AreaComponent', () => {
  let component: AreaComponent;
  let fixture: ComponentFixture<AreaComponent>;
  let areaService: AreaService;
  let router: Router;
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaComponent],
      providers: [
        { provide: AreaService, useValue: { getMarkerData: () => [], setMarkerData: () => {} } },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: LocalStorageService, useValue: { removeData: () => {}, setData: () => {}, getData: () => {} } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AreaComponent);
    component = fixture.componentInstance;
    areaService = TestBed.inject(AreaService);
    router = TestBed.inject(Router);
    localStorageService = TestBed.inject(LocalStorageService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate area and store in local storage', () => {
    const mockMarkers = [{ lat: 40.7128, lng: -74.0060 }, { lat: 40.7129, lng: -74.0061 }];
    spyOn(areaService, 'getMarkerData').and.returnValue(mockMarkers);
    spyOn(localStorageService, 'removeData');
    spyOn(localStorageService, 'setData');

    component.calcArea();

    expect(localStorageService.removeData).toHaveBeenCalledWith('areaResult');
    expect(localStorageService.setData).toHaveBeenCalledWith('areaResult', jasmine.any(Number));
  });

  it('should get area result from local storage', () => {
    spyOn(localStorageService, 'getData').and.returnValue(100);

    const areaResult = component.getAreaRes();

    expect(areaResult).toBe(100);
  });

  it('should navigate back to home and remove area result from local storage', () => {
    spyOn(localStorageService, 'removeData');
    spyOn(router, 'navigate');

    component.goBack();

    // expect(localStorageService.removeData).toHaveBeenCalledWith('areaResult');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });
});

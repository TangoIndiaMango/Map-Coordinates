import { TestBed } from '@angular/core/testing';
import { LocationService, Location } from './location.service';
import { NotificationService } from './notification.service';


describe('LocationService', () => {
  let service: LocationService;
  let navigatorSpy: jasmine.Spy;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationServiceMock = jasmine.createSpyObj('NotificationService', ['infoMessage']);
    TestBed.configureTestingModule({
      providers: [
        LocationService,
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    });
    service = TestBed.inject(LocationService);

    navigatorSpy = spyOn(
      navigator.geolocation,
      'getCurrentPosition'
    ).and.callFake((...args: any[]) => {
      const position = { coords: { latitude: 37.7749, longitude: -174.006 } };
      args[0](position);
    });
  });

  afterEach(() => {
    navigatorSpy.and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store and retrieve location correctly', () => {
    const testLocation = { lat: 40.7128, lng: -74.006 };

    service.storeLocation(testLocation);
    expect(service.getLocation()).toContain(testLocation);
    const storedLocation = service.getLocation();

    expect(storedLocation.length).toBe(1);
    expect(storedLocation[0]).toEqual(testLocation);
  });

  it('should clear location', () => {
    service.storeLocation({ lat: 40.7128, lng: -74.006 });
    service.clearLocation();

    expect(service.getLocation().length).toBe(0);
    expect(service.getLocation()).toEqual([]);
  });

  it('should clear last location', () => {
    const location1: Location = { lat: 40.7128, lng: -74.006 };
    const location2: Location = { lat: 51.5072, lng: 0.1276 };
    service.storeLocation(location1);
    service.storeLocation(location2);
    service.clearLastLocation();
    expect(service.getLocation()).toEqual([location1]);
  });

  it(
    'should get user location',
    (done) => {
      const subscription = service.flag$.subscribe((flag) => {
        if (flag) {
          const location = service.getLocation()[0];
          expect(location.lat).toEqual(37.7749);
          expect(location.lng).toEqual(-174.006);
          subscription.unsubscribe();
          done();
        }
      });
      service.getUserLocation();
    }
  );


});

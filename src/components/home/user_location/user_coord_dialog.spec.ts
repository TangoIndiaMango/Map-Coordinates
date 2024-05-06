import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDialogComponent } from './user_cord_dialog';
import { LocationService } from '../../../services/location.service';
import { NotificationService } from '../../../services/notification.service';

describe('UserDialogComponent', () => {
  let component: UserDialogComponent;
  let fixture: ComponentFixture<UserDialogComponent>;
  let locationServiceMock: jasmine.SpyObj<LocationService>;
  let notificationServiceMock: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    locationServiceMock = jasmine.createSpyObj('LocationService', [
      'getLocation',
    ]);
    notificationServiceMock = jasmine.createSpyObj('NotificationService', [
      'error',
    ]);

    await TestBed.configureTestingModule({
      imports: [UserDialogComponent],
      providers: [
        { provide: LocationService, useValue: locationServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle the visibility of the dialog', () => {
    component.showDialog();
    expect(component.visible).toBeTrue();

    component.closeDialog();
    expect(component.visible).toBeFalse();
  });
});

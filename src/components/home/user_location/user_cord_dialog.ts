import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { Location, LocationService } from '../../../services/location.service';
import { NotificationService } from '../../../services/notification.service';
import { notZero } from './utils';

@Component({
  standalone: true,
  selector: 'user-dialog',
  templateUrl: './user_coord_dialog.html',
  imports: [
    DialogModule,
    ButtonModule,
    InputTextModule,
    CommonModule,
    ToastModule,
    ReactiveFormsModule,
  ],
  providers: [LocationService],
})


export class UserDialogComponent {
  visible = false;
  form: FormGroup;
  userLocation: Location = { lat: 0, lng: 0 };

  @Input() lat: number = 0;
  @Input() lng: number = 0;

  @Output() saveCoordinates = new EventEmitter<Location>();

  constructor(
    private locationService: LocationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      lat: [
        '',
        [
          Validators.min(-90),
          Validators.max(90),
          Validators.required,
          Validators.pattern(/^-?\d+(\.\d+)?$/),
        ],
      ],
      lng: [
        '',
        [
          Validators.min(-90),
          Validators.max(90),
          Validators.required,
          Validators.pattern(/^-?\d+(\.\d+)?$/)
        ],
      ],
      generateCoordinate: [false],
    });
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.clearInputBox();
  }

  get latForm() {
    return this.form.get('lat');
  }

  get lngForm() {
    return this.form.get('lng');
  }

  onSave() {
    if (this.form.valid) {
      this.saveCoordinates.emit({
        lat: this.form.get('lat')?.value,
        lng: this.form.get('lng')?.value,
      });
      this.closeDialog();
      this.notificationService.successMessage(
        'User Location',
        'Your Location has been updated Successfully'
      );
    } else {
      this.notificationService.errorMessage(
        'Error',
        'Please enter valid coordinates'
      );
    }
  }

  async onGenerate() {
    if (this.form.get('generateCoordinate')?.value) {
      await this.fetchUserLocation();
      const userLocation = this.locationService.getLocation()[0];
      if (userLocation) {
        this.form.get('lat')?.setValue(userLocation.lat);
        this.form.get('lng')?.setValue(userLocation.lng);
        this.notificationService.successMessage(
          'Generated Location',
          'Generated Location Successfully'
        );
      }
    } else {
      this.clearInputBox();
    }
  }

  async fetchUserLocation(): Promise<Location | null> {
    return new Promise<Location | null>((resolve, reject) => {
      this.locationService.flag$.subscribe((flag) => {
        if (flag) {
          const userLocation = this.locationService.getLocation()[0];
          resolve(userLocation);
        } else {
          reject(null);
        }
      });
    });
  }

  clearInputBox() {
    this.form.reset();
  }
}

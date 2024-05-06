import { CommonModule } from '@angular/common';
import { Component, ErrorHandler } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { LocationService } from '../../services/location.service';
import { LogginService } from '../../services/logging.service';
import { GlobalErrorHandler } from '../../services/errors.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-coordinates',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    RouterOutlet,
    RouterLink,
    CommonModule,
    ToastModule,
  ],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }],
  templateUrl: './add-coordinates.component.html',
})
export class AddCoordinatesComponent {
  locations: any = [];
  coordinatesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService,
    private locationService: LocationService,
    private logginService: LogginService,
    private errrorService: ErrorHandler
  ) {
    this.coordinatesForm = this.fb.group({
      coordinates: this.fb.array([this.createCoordinateGroup()]),
    });
  }

  createCoordinateGroup(): FormGroup {
    return this.fb.group({
      lat: [
        '',
        [
          Validators.required,
          Validators.min(-90),
          Validators.max(90),
          Validators.pattern(/^-?\d+(\.\d+)?$/),
        ],
      ],
      lng: [
        '',
        [
          Validators.required,
          Validators.min(-180),
          Validators.max(180),
          Validators.pattern(/^-?\d+(\.\d+)?$/),
        ],
      ],
    });
  }

  get coordinates(): FormArray {
    return this.coordinatesForm.get('coordinates') as FormArray;
  }

  addInputBox() {
    this.coordinates.push(this.createCoordinateGroup());
  }

  addCoordinate(event: any) {
    event.preventDefault();
    if (!this.coordinatesForm.valid) {
      this.notificationService.errorMessage('Error', 'Invalid form');
      this.errrorService.handleError(new Error('Invalid form'));
      return;
    }
    if (this.coordinates.length < 4) {
      this.notificationService.errorMessage(
        'Error',
        'Please add at least 4 coordinates'
      );
      this.errrorService.handleError(
        new Error('Please add at least 4 coordinates')
      );
      return;
    }
    const coordinates = this.coordinatesForm.value.coordinates;
    this.locationService.storeLocation(coordinates);
    this.logginService.logInfo(coordinates);
    this.notificationService.successMessage('Success', 'Coordinates Updated');
    this.router.navigate(['/home']);
  }

}

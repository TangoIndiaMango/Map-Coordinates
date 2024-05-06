import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

export function notZero(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  const controlValue: number = control.value;
  if (controlValue !== 0) {
    return of(null);
  } else {
    return of({ notZero: true });
  }
}

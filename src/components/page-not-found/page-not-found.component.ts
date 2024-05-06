import { Component } from '@angular/core';
import { CommonComponent } from '../common/common.components';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [CommonComponent],
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {
  //go home route
}

import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { LocalStorageService } from '../../services/localStorage.service';
import { Marker, calculatePolygonArea } from '../../../utils/helpers';
import { AreaService } from '../../services/area.service';


@Component({
  selector: 'app-area',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './area.component.html',
})
export class AreaComponent {
  markers: Marker[] = [];
  todaysDate = new Date();
  localStorageService = inject(LocalStorageService);
  areaofEnclosedMarkers: number | undefined;

  constructor(private areaService: AreaService, private router: Router) {
    this.markers = this.areaService.getMarkerData();
  }

  calcArea() {
    this.localStorageService.removeData('areaResult');
    this.areaofEnclosedMarkers = calculatePolygonArea(this.markers);
    this.localStorageService.setData('areaResult', this.areaofEnclosedMarkers);
  }

  getAreaRes() {
    return this.localStorageService.getData('areaResult');
  }

  goBack() {
    this.localStorageService.removeData('areaResult');

    this.router.navigate(['/home']);
  }
}

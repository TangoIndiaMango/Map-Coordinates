import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AddCoordinatesComponent } from '../components/add-coordinates/add-coordinates.component';
import { AreaComponent } from '../components/area/area.component';
import { PageNotFoundComponent } from '../components/page-not-found/page-not-found.component';
import { canHaveAccess } from '../auth/authentication.guard';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    component: HomeComponent,
  },
  {
    path: 'add',
    title: 'Add Coordinates',
    component: AddCoordinatesComponent,
    canActivate: [canHaveAccess],
  },
  {
    path: 'area',
    title: 'Calculate Area',
    component: AreaComponent,
    canActivate: [canHaveAccess],
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: '**',
    title: 'Page Not Found',
    component: PageNotFoundComponent,
  },
];

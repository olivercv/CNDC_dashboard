import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MapCentralesComponent } from './map-centrales/map-centrales.component';
import { MapTransmisionComponent } from './map-transmision/map-transmision.component';

export const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'map-centrales', component: MapCentralesComponent },
  { path: 'map-transmision', component: MapTransmisionComponent },
];

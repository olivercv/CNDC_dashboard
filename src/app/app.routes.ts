import { Routes } from '@angular/router';
import { MapCentralesComponent } from './map-centrales/map-centrales.component';
import { DashboardMapComponent } from './dashboard-map/dashboard-map.component';
import { MapTransferenciasComponent } from './map-transferencias/map-transferencias.component';

export const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardMapComponent },
  { path: 'map-centrales', component: MapCentralesComponent },
  { path: 'map-transferencias', component: MapTransferenciasComponent },
];

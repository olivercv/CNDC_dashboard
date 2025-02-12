import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CostoMarginalRealComponent } from './costo-marginal-real/costo-marginal-real.component';

export const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'costo', component: CostoMarginalRealComponent },
];

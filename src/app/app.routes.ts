import { Routes } from '@angular/router';
import { MapCentralesComponent } from './map-centrales/map-centrales.component';
import { DashboardMapComponent } from './dashboard-map/dashboard-map.component';
import { MapTransferenciasComponent } from './map-transferencias/map-transferencias.component';
import { CostoMarginalRealComponent } from './costo-marginal-real/costo-marginal-real.component';
import { DemandaComponent } from './demanda/demanda.component';
import { GeneradaComponent } from './generada/generada.component';
import { FrecuenciaComponent } from './frecuencia/frecuencia.component';
import { InjectadaComponent } from './injectada/injectada.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';


export const routes: Routes = [

  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardMapComponent },
  { path: 'map-centrales', component: MapCentralesComponent },
  { path: 'map-centrales/:id', component: MapCentralesComponent },
  { path: 'map-transferencias', component: MapTransferenciasComponent },
  { path: 'map-transferencias/:id', component: MapTransferenciasComponent },
  { path: 'costo-marginal-real', component: CostoMarginalRealComponent },
  { path: 'demanda-tiempo-real', component: DemandaComponent },
  { path: 'generada-tiempo-real', component: GeneradaComponent },
  { path: 'frecuencia', component: FrecuenciaComponent },
  { path: 'injectada', component: InjectadaComponent },
  { path: 'capacidad-efectiva', component: PieChartComponent },
];

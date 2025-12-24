import { Component } from '@angular/core';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { SimpleChartComponent } from '../simple-chart/simple-chart.component';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { LinesChartComponent } from '../lines-chart/lines-chart.component';
import { TabContainerComponent } from '../tab-container/tab-container.component';
import { GeneradaComponent } from '../generada/generada.component';
import { DemandaComponent } from '../demanda/demanda.component';
import { InjectadaComponent } from '../injectada/injectada.component';
import { CostoMarginalRealComponent } from '../costo-marginal-real/costo-marginal-real.component';
import { FrecuenciaComponent } from '../frecuencia/frecuencia.component';




@Component({
  selector: 'app-dashboard',
  imports: [TabContainerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  // Tabs de la columna izquierda
  leftTabs = [
    { label: 'Frecuencia', component: FrecuenciaComponent },
    { label: 'Capacidad Efectiva', component: PieChartComponent }
    
  ];

  // Tabs de la columna central
  centerTabs = [
    { label: 'Generacion en tiempo real', component: GeneradaComponent },
    { label: 'Demanda en tiempo real', component: DemandaComponent }
  ];

  // Tabs de la columna derecha
  rightTabs = [
    { label: 'Energia Inyectada', component: InjectadaComponent },
    { label: 'Costo Marginal', component: CostoMarginalRealComponent }
  ];


}

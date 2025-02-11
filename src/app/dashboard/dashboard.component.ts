import { Component } from '@angular/core';
import { LineChartComponent } from '../line-chart/line-chart.component';
import { SimpleChartComponent } from '../simple-chart/simple-chart.component';
import { AreaChartComponent } from '../area-chart/area-chart.component';
import { PieChartComponent } from '../pie-chart/pie-chart.component';
import { LinesChartComponent } from '../lines-chart/lines-chart.component';
import { TabContainerComponent } from '../tab-container/tab-container.component';
import { GeneradaComponent } from '../generada/generada.component';




@Component({
  selector: 'app-dashboard',
  imports: [TabContainerComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  // Tabs de la columna izquierda
  leftTabs = [
    { label: 'Capacidad Efectiva', component: PieChartComponent },
    { label: 'Frecuencia', component: SimpleChartComponent }
  ];

  // Tabs de la columna central
  centerTabs = [
    { label: 'Generacion de Energía', component: GeneradaComponent },
    { label: 'Demanda de Energía', component: LineChartComponent }
  ];

  // Tabs de la columna derecha
  rightTabs = [
    { label: 'Energia Inyectada', component: AreaChartComponent },
    { label: 'Gráfico Simple', component: SimpleChartComponent }
  ];


}

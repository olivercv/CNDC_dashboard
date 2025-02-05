import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { SimpleChartComponent } from './simple-chart/simple-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { LinesChartComponent } from './lines-chart/lines-chart.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LineChartComponent, AreaChartComponent, SimpleChartComponent, LinesChartComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cndc-dashboard';
}

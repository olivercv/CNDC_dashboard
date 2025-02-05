import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import Highcharts3d from 'highcharts/highcharts-3d';
import { HighchartsChartModule } from 'highcharts-angular';

// Asegurar que Highcharts 3D está inicializado **antes de usarlo**
Highcharts3d(Highcharts);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  ngOnInit(): void {
    console.log('Inicializando gráfico 3D...');

    this.chartOptions = {
      chart: {
        type: 'pie',
        options3d: { enabled: true, alpha: 45, beta: 0 }
      },
      title: { text: 'Gráfico Pie 3D' },
      plotOptions: {
        pie: {
          depth: 35,
          dataLabels: { enabled: true, format: '{point.name}' }
        }
      },
      series: [{
        type: 'pie',
        name: 'Participación',
        data: [
          ['Samsung', 23], ['Apple', 18], ['Xiaomi', 12],
          ['Oppo', 9], ['Vivo', 8], ['Otros', 30]
        ]
      }]
    };
  }
}

import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { mockData } from '../data/mock-data';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Título Genérico 4'
    },
    subtitle: {
      text: 'Datos con tiempos irregulares'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        month: '%e. %b',
        year: '%b'
      },
      title: {
        text: 'Fecha'
      }
    },
    yAxis: {
      title: {
        text: 'Profundidad'
      },
      min: 0
    },
    tooltip: {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
    },
    plotOptions: {
      series: {
        marker: {
          symbol: 'circle',
          fillColor: '#FFFFFF',
          lineWidth: 1,
          lineColor: undefined, // Esto asegura que use el mismo color de la línea
          enabled: true,
          radius: 2.5,
        }
      }
    },
    colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
    series: mockData as Highcharts.SeriesOptionsType[] // Asegura el tipo correcto
  };
}

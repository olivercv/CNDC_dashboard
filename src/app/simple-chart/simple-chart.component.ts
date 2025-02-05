import { Component } from '@angular/core';
import * as Highcharts from 'highcharts/highcharts';
import { HighchartsChartModule } from 'highcharts-angular';

@Component({
  selector: 'app-simple-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './simple-chart.component.html',
  styleUrls: ['./simple-chart.component.css']
})
export class SimpleChartComponent {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie'
    },
    title: {
      text: 'Título Genérico 1'
    },
    tooltip: {
      valueSuffix: '%'
    },
    subtitle: {
      text: 'Fuente: <a href="https://www.mdpi.com/2072-6643/11/3/684/htm" target="_default">MDPI</a>'
    },
    plotOptions: {
      pie: {
        size: '80%',  // Ajusta el tamaño del pie
        dataLabels: {
          enabled: true,
          format: '{point.name}: {point.percentage:.1f}%',
          style: {
            fontSize: '0.8em',  // Ajusta el tamaño de la fuente de las etiquetas
            textOutline: 'none',
            opacity: 0.7
          }
        }
      }
    },
    series: [
      {
        type: 'pie',
        name: 'Porcentaje',
        data: [
          {
            name: 'Agua',
            y: 55.02
          },
          {
            name: 'Grasa',
            sliced: true,
            selected: true,
            y: 26.71
          },
          {
            name: 'Carbohidratos',
            y: 1.09
          },
          {
            name: 'Proteina',
            y: 15.5
          },
          {
            name: 'Carbon',
            y: 1.68
          }
        ]
      }
    ]
  };
}

import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { mockDataLines } from '../data/mock-data-lines';

@Component({
  selector: 'app-lines-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './lines-chart.component.html',
  styleUrls: ['./lines-chart.component.css']
})
export class LinesChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;

  ngOnInit() {
    const allSessions = mockDataLines.map(d => d.sessions);
    const newUsers = mockDataLines.map(d => d.users);
    const dates = mockDataLines.map(d => d.date);

    Highcharts.addEvent(Highcharts.Point, 'click', function () {
      const className = this.series.options.className;
      if (className && className.indexOf('popup-on-click') !== -1) {
        const chart = this.series.chart as any;
        const date = chart.time.dateFormat('%A, %b %e, %Y', this.x);
        const text = `<b>${date}</b><br/>${this.y} ${this.series.name}`;

        const anchorX = (this.plotX ?? 0) + this.series.xAxis.pos;
        const anchorY = (this.plotY ?? 0) + this.series.yAxis.pos;
        const align = anchorX < chart.chartWidth - 200 ? 'left' : 'right';
        const x = align === 'left' ? anchorX + 10 : anchorX - 10;
        const y = anchorY - 30;
        if (!chart.sticky) {
          chart.sticky = chart.renderer
            .label(text, x, y, 'callout',  anchorX, anchorY)
            .attr({
              align,
              fill: 'rgba(0, 0, 0, 0.75)',
              padding: 10,
              zIndex: 7 // Above series, below tooltip
            })
            .css({
              color: 'white'
            })
            .on('click', function () {
              chart.sticky = chart.sticky.destroy();
            })
            .add();
        } else {
          chart.sticky
            .attr({ align, text })
            .animate({ anchorX, anchorY, x, y }, { duration: 250 });
        }
      }
    });

    this.chartOptions = {
      chart: {
        scrollablePlotArea: {
          minWidth: 700
        }
      },
      title: {
        text: 'Título Genérico 2',
        align: 'left'
      },
      subtitle: {
        text: 'Fuente: Google Analytics'
      },
      xAxis: {
        categories: dates,
        tickInterval: 7, // Un intervalo de 7 días para las etiquetas
        tickWidth: 1,
        gridLineWidth: 1,
        crosshair: true, // Habilita la línea de cruce vertical
        labels: {
          align: 'left',
          x: 3,
          y: 20, // Desplaza las etiquetas hacia abajo
          format: '{value}'
        }
      },
      yAxis: [{ // left y axis
        title: {
          text: null
        },
        labels: {
          align: 'right',
          x: -10, // Ajusta la posición X para que esté fuera del plot
          y: 16,
          formatter: function () {
            // Asegurarse de que el valor es un número antes de dividirlo
            const value = typeof this.value === 'number' ? this.value : parseFloat(this.value);
            return value / 1000 + 'K'; // Muestra los valores en miles con 'K'
          }
        },
        gridLineWidth: 1, // Asegura que las líneas de la cuadrícula estén presentes
        showFirstLabel: false
      }, { // right y axis
        linkedTo: 0,
        gridLineWidth: 1, // Asegura que las líneas de la cuadrícula estén presentes
        opposite: true,
        title: {
          text: null
        },
        labels: {
          align: 'left',
          x: 10, // Ajusta la posición X para que esté fuera del plot
          y: 16,
          formatter: function () {
            // Asegurarse de que el valor es un número antes de dividirlo
            const value = typeof this.value === 'number' ? this.value : parseFloat(this.value);
            return value / 1000 + 'K'; // Muestra los valores en miles con 'K'
          }
        },
        showFirstLabel: false
      }],
      legend: {
        align: 'left',
        verticalAlign: 'top',
        borderWidth: 0
      },
      tooltip: {
        shared: true
      },
      plotOptions: {
        series: {
          cursor: 'pointer',
          className: 'popup-on-click',
          marker: {
            lineWidth: 1
          }
        }
      },
      series: [{
        type: 'line', // Agrega el tipo aquí
        name: 'Todas las sessiones',
        data: allSessions,
        lineWidth: 4,
        marker: {
          radius: 4
        }
      }, {
        type: 'line', // Agrega el tipo aquí
        name: 'Nuevos Usuarios',
        data: newUsers
      }]
    };
  }
}

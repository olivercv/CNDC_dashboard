import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import Highcharts3D from 'highcharts/highcharts-3d';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import { HttpClient } from '@angular/common/http';

// Asegurar que los módulos se carguen correctamente
if (typeof Highcharts3D === 'function') {  Highcharts3D(Highcharts); }
if (typeof HighchartsMore === 'function') { HighchartsMore(Highcharts); } 
if (typeof HighchartsAccessibility === 'function') { HighchartsAccessibility(Highcharts);} 

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      marginTop: 50,
      marginBottom: 50,
    },
    title: {
      text: 'Capacidad Efectiva del SIN',
    },
    subtitle: {
      text: 'Porcentaje de Participación'
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      enabled: false,
    },
    credits: { enabled: false },
    plotOptions: {
      pie: {
        size: '70%',
        allowPointSelect: true,
        cursor: 'pointer',
        depth: 35,
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          distance: 10,
          style: {
            fontSize: '10px',
            color: '#000',
          },
        },
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Energía',
        data: [], // Datos iniciales vacíos
      },
    ],
  };

  alpha: number = 45;
  beta: number = 0;

  constructor(private http: HttpClient) {} // Inyecta HttpClient

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const apiUrl = 'https://cndcapi.cndc.bo/WebNoDate?code=1';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        // Filtrar el item "TOTAL" si no deseas mostrarlo
        const filteredData = data.filter(item => item.titulo !== 'TOTAL');
        
        const chartData = filteredData.map(item => ({
          name: item.titulo,
          y: item.valor,
        }));

        this.chartOptions.series = [
          {
            type: 'pie',
            name: 'Energía',
            data: chartData,
          },
        ];

        this.chartOptions = { ...this.chartOptions }; // Forzar actualización
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
      }
    });
  }

  updateChart() {
    this.chartOptions.chart!.options3d = {
      enabled: true,
      alpha: this.alpha,
      beta: this.beta,
    };
    this.chartOptions = { ...this.chartOptions }; // Forzar la actualización
  }

  onSliderChange(event: Event, type: 'alpha' | 'beta') {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    if (type === 'alpha') {
      this.alpha = value;
    } else {
      this.beta = value;
    }
    this.updateChart();
  }
}
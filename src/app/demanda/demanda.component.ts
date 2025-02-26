import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClient } from '@angular/common/http';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-demanda',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './demanda.component.html',
  styleUrls: ['./demanda.component.css']
})
export class DemandaComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  private intervalId: any;

  private styles: { name: string, dashStyle: 'Solid' | 'Dash' | 'Dot', realName: string, color: string }[] = [
    { name: 'Prev.SCZ', dashStyle: 'Dot', realName: 'Prev. SCZ', color: "#0da209" },
    { name: 'SANTA CRUZ', dashStyle: 'Solid', realName: 'Santa Cruz', color: "#086432" },
    { name: 'LA PAZ', dashStyle: 'Solid', realName: 'La Paz', color: '#4f2783' },
    { name: 'COCHABAMBA', dashStyle: 'Solid', realName: 'Cochabamba', color: '#3188e5' },
    { name: 'POTOSI', dashStyle: 'Solid', realName: 'Potosí', color:'#aa1400' },
    { name: 'ORURO', dashStyle: 'Solid', realName: 'Oruro', color: '#795548' },
    { name: 'TARIJA', dashStyle: 'Solid', realName: 'Tarija', color: '#fa9802' },
    { name: 'CHUQUISACA', dashStyle: 'Solid', realName: 'Chuquizaca', color: '#2782b9' },
    { name: 'BENI', dashStyle: 'Solid', realName: 'Beni', color: '#46c864' }
  ];

  constructor(private http: HttpClient, private zone: NgZone) {}

  ngOnInit() {
    this.fetchData();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    this.stopAutoRefresh();
  }

  startAutoRefresh() {
    this.zone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => this.fetchData(), 15000);
    });
  }

  stopAutoRefresh() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  fetchData() {
    const fechaApiUrl = 'https://cndcapi.cndc.bo/WebApiFechas';
    const dataApiUrl = 'https://cndcapi.cndc.bo/WebApi?code=1&Fecha=';

    this.http.get<any[]>(fechaApiUrl).subscribe({
      next: (fechas) => {
        const fechaTiempoReal = fechas.find(f => f.tipo === 'TIEMPO_REAL')?.fecha;
        if (!fechaTiempoReal) return;

        this.http.get<any[]>(dataApiUrl + fechaTiempoReal).subscribe({
          next: (data) => {
            const baseDate = new Date(fechaTiempoReal.split('.').reverse().join('-'));
            if (isNaN(baseDate.getTime())) {
              console.error('Fecha inválida:', fechaTiempoReal);
              return;
            }

            let seriesData = data.map(item => ({
              name: item.codigo,
              data: item.valores.map((val: number, index: number) => {
                const timestamp = baseDate.getTime() + (index * 900000); // 15 minutos en ms (15 * 60 * 1000)
                return [timestamp, val === -1 ? null : val];
              }),
            }));

            // Ordenar las series según el vector de estilos
            seriesData.sort((a, b) => {
              const indexA = this.styles.findIndex(s => s.name === a.name);
              const indexB = this.styles.findIndex(s => s.name === b.name);
              return indexA - indexB;
            });

            this.chartOptions = {
              chart: { 
                type: 'line', 
                scrollablePlotArea: { minWidth: 700 },
              },
              title: { text: 'Demanda de Energía', align: 'center' },
              subtitle: { text: `Datos en tiempo real en Fecha: ${fechaTiempoReal}` },
              xAxis: {
                title: { text: 'Horas' },
                type: 'datetime',
                min: baseDate.getTime(),
                max: baseDate.getTime() + 86400000, // 24 horas
                tickInterval: 3600000*3, // 3 horas
                labels: { format: '{value:%H:%M}' },
                crosshair: {
                  width: 1, // Grosor mínimo
                  color: '#ccc' // Color neutro
                }
              },
              yAxis: { title: { text: 'MW' } },
              legend: { align: 'center', verticalAlign: 'bottom' },
              tooltip: {
                shared: true,
                headerFormat: '<b>{point.key:%H:%M}</b><br/>',
                pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b> MW<br/>',
                animation: false // Desactiva animaciones innecesarias
              },
              plotOptions: {
                series: {
                  stickyTracking: false,
                  marker: {
                    enabled: false // Desactiva marcadores si no son críticos
                  },
                  events: {
                    mouseOver: function () {
                      const chart = this.chart;
                      chart.series.forEach(s => {
                        if (s !== this) {
                          s.update({ opacity: 0.2, type: s.type as any }, false); // Atenuar otras series
                        }
                      });
                      chart.redraw();
                    },
                    mouseOut: function () {
                      const chart = this.chart;
                      chart.series.forEach(s => {
                        if (s !== this) {
                          s.update({ opacity: 1, type: s.type as any }, false); // Restaurar opacidad
                        }
                      });
                      chart.redraw();
                    }
                  }
                }
              },
              boost: {
                enabled: true,
                useGPUTranslations: true,
                allowForce: true
              },
              credits: { enabled: false },
              series: seriesData.map(item => {
                const style = this.styles.find(s => s.name === item.name) || { dashStyle: 'Solid', realName: item.name, color: '#000000' };
                return {
                  type: 'line',
                  name: style.realName,
                  data: item.data,
                  color: style.color, // Asignar color desde el objeto de estilos
                  dashStyle: style.dashStyle, // Asignar estilo desde el objeto de estilos
                  marker: { 
                    symbol: 'circle', // Asegurarse de que cada serie use círculos
                    radius: 0, // El tamaño predeterminado del marcador es 0 (sin marcadores)
                    states: {
                      hover: {
                        radius: 3 // Tamaño del círculo en hover (puedes cambiar el valor)
                      }
                    }
                  },
                };
              }),
            };

            // Forzar actualización del gráfico
            this.chartOptions = { ...this.chartOptions };
          },
          error: (error) => console.error('Error en datos:', error),
        });
      },
      error: (error) => console.error('Error en fecha:', error),
    });
  }
}

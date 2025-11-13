import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { HttpClient } from '@angular/common/http';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-injectada',
  standalone: true,
  imports: [HighchartsChartModule],
  templateUrl: './injectada.component.html',
  styleUrls: ['./injectada.component.css'],
})
export class InjectadaComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions!: Highcharts.Options;
  private intervalId: any;

  private styles: {
    name: string;
    dashStyle: 'Solid' | 'Dash' | 'Dot';
    realName: string;
    color: string;
  }[] = [
    { name: 'TERMO', dashStyle: 'Solid', realName: 'Termoeléctrica', color: '#E3371E'},
    { name: 'HIDRO', dashStyle: 'Solid', realName: 'Hidroeléctrica', color: '#3188e5'},
    { name: 'SOLAR', dashStyle: 'Solid', realName: 'Solar', color: '#fab610' },
    { name: 'EOL', dashStyle: 'Solid', realName: 'Eólica', color: '#103778' },
    { name: 'BAGAZO', dashStyle: 'Solid', realName: 'Bagazo', color: '#A6BC09'},
    { name: 'SIS', dashStyle: 'Solid', realName: 'Total', color: '#CACACA' },
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
    const fechaApiUrl = 'https://webapi.cndc.bo/WebApiFechas';
    const dataApiUrl = 'https://webapi.cndc.bo/WebApi?code=6&Fecha=';

    this.http.get<any[]>(fechaApiUrl).subscribe({
      next: (fechas) => {
        const fechaTiempoReal = fechas.find(
          (f) => f.tipo === 'POSTDESPACHO'
        )?.fecha;
        if (!fechaTiempoReal) return;

        this.http.get<any[]>(dataApiUrl + fechaTiempoReal).subscribe({
          next: (data) => {
            const baseDate = new Date(
              fechaTiempoReal.split('.').reverse().join('-')
            );
            if (isNaN(baseDate.getTime())) {
              console.error('Fecha inválida:', fechaTiempoReal);
              return;
            }

            let seriesData = data.map((item) => {
              const valores = item.valores;
              const dataPoints = valores.map((val: number, index: number) => {
                const timestamp = baseDate.getTime() + index * 900000 * 4; // 15min * 4 = 1 hora
                return [timestamp, val === -1 ? null : val];
              });

              // Agregar punto extra a las 24:00 para completar la curva
              const lastTimestamp = baseDate.getTime() + 24 * 3600 * 1000;
              const lastValue = valores[valores.length - 1] === -1 ? null : valores[valores.length - 1];
              dataPoints.push([lastTimestamp, lastValue]);

              return {
                name: item.codigo,
                data: dataPoints,
              };
            });

            // Ordenar según estilos
            seriesData.sort((a, b) => {
              const indexA = this.styles.findIndex((s) => s.name === a.name);
              const indexB = this.styles.findIndex((s) => s.name === b.name);
              return indexA - indexB;
            });

            const xAxisOptions: Highcharts.XAxisOptions = {
              title: { text: 'Horas' },
              type: 'datetime',
              min: baseDate.getTime(),
              max: baseDate.getTime() + 24 * 3600 * 1000,
              labels: {
                formatter: function (this: Highcharts.AxisLabelsFormatterContextObject) {
                  const date = new Date(Number(this.value));
                  if (
                    date.getUTCHours() === 0 &&
                    date.getUTCMinutes() === 0 &&
                    date.getTime() !== baseDate.getTime()
                  ) {
                    return '24:00';
                  }
                  return Highcharts.dateFormat('%H:%M', Number(this.value));
                },
              },
              crosshair: { width: 1, color: '#ccc' },
              tickPositioner: function (...args: any[]): number[] {
                const min = args[0];
                const max = args[1];
                const positions: number[] = [];
                const step = 4 * 3600 * 1000;

                for (let pos = min; pos <= max; pos += step) {
                  positions.push(pos);
                }
                return positions;
              },
            };

            this.chartOptions = {
              chart: {
                type: 'area',
                scrollablePlotArea: { minWidth: 700 },
              },
              title: { text: 'Energía Inyectada', align: 'center' },
              subtitle: { text: `Datos en Fecha: ${fechaTiempoReal}` },
              xAxis: xAxisOptions,
              yAxis: { title: { text: 'MWh' } },
              credits: { enabled: false },
              legend: { align: 'center', verticalAlign: 'bottom' },
              tooltip: {
                shared: true,
                headerFormat: '<b>{point.key:%H:%M}</b><br/>',
                pointFormat:
                  '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}</b> MWh<br/>',
                animation: false,
              },
              plotOptions: {
                area: {
                  fillOpacity: 0.35,  
                  marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                      hover: { enabled: true },
                    },
                  },
                },
              },
              boost: {
                enabled: true,
                useGPUTranslations: true,
                allowForce: true,
              },
              series: seriesData.reverse().map((item) => {
                const style = this.styles.find((s) => s.name === item.name) || {
                  dashStyle: 'Solid',
                  realName: item.name,
                  color: '#000000',
                };
                return {
                  type: 'area',
                  name: style.realName,
                  data: item.data,
                  color: style.color,
                  dashStyle: style.dashStyle,
                  marker: {
                    symbol: 'circle',
                    radius: 0,
                    states: {
                      hover: {
                        radius: 3,
                      },
                    },
                  },
                };
              }),
            };

            this.chartOptions = { ...this.chartOptions };
          },
          error: (error) => console.error('Error en datos:', error),
        });
      },
      error: (error) => console.error('Error en fecha:', error),
    });
  }
}

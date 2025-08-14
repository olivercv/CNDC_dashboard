import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, map, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LiveDataService {

  private baseUrl = 'https://webapi.cndc.bo';

  constructor(private http: HttpClient) {}

  // 📌 Obtener datos históricos y ajustar con hora local
getHistoricalData(maxPoints: number) {
  return this.http.get<{ valor: number | string, hora: string }[]>(
    `${this.baseUrl}/WebApiFrecuencia/historial?registros=${maxPoints}`
  ).pipe(
    map(data => {
      const now = new Date();
      return data.map((point, index) => {
        // Restamos segundos para simular el historial en la hora local
        const pointDate = new Date(now);
        pointDate.setSeconds(pointDate.getSeconds() - (maxPoints - index));

        // Convertir a número y redondear a 2 decimales
        const valorRedondeado = Number(Number(point.valor).toFixed(2));

        return [pointDate.getTime(), valorRedondeado];
      });
    })
  );
}


  // 📌 Obtener datos en tiempo real cada segundo usando hora local
  getLiveData() {
    return interval(1000).pipe(
      switchMap(() => this.http.get<{ frequency: number }>(
        `${this.baseUrl}/WebApiFrecuencia`
      )),
      map(data => {
        const now = new Date();
        const freqNum = Number(data.frequency); 
        return {
          timestamp: now.getTime(),
          frequency: Number(freqNum.toFixed(2))
        };
      })
    );
  }
}

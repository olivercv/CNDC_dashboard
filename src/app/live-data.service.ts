import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LiveDataService {

  constructor() { }

  getLiveData(): Observable<{ frequency: number, dateTime: string }> {
    return interval(1000).pipe(
      map(() => {
        const [timestamp, frequency] = this.getLiveDataPoint();
        return {
          frequency: frequency,
          dateTime: this.formatDate(new Date(timestamp))
        };
      })
    );
  }

  private getLiveDataPoint(): [number, number] {
    return [Date.now(), parseFloat((Math.random() * (50.05 - 49.95) + 49.95).toFixed(2))];
  }

  private formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  }
}
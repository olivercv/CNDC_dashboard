import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface CapacidadData {
  titulo: string;
  valor: number;
}

@Component({
  selector: 'app-tabla-capacidad',
  imports: [CommonModule],
  templateUrl: './tabla-capacidad.component.html',
  styleUrl: './tabla-capacidad.component.css'
})
export class TablaCapacidadComponent implements OnInit {
  capacidadData: CapacidadData[] = [];
  loading: boolean = true;
  error: string | null = null;
  total: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const apiUrl = 'https://webapi.cndc.bo/WebNoDate?code=1';
    this.http.get<CapacidadData[]>(apiUrl).subscribe({
      next: (data) => {
        this.capacidadData = data.filter(item => item.titulo !== 'TOTAL');
        this.total = data.find(item => item.titulo === 'TOTAL')?.valor || 0;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener datos:', error);
        this.error = 'Error al cargar los datos';
        this.loading = false;
      }
    });
  }

  calculatePercentage(valor: number): number {
    return this.total > 0 ? (valor / this.total) * 100 : 0;
  }
}

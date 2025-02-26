import { Component } from '@angular/core';
import { TabContainerComponent } from '../tab-container/tab-container.component';
import { GeneradaComponent } from '../generada/generada.component';
import { DemandaComponent } from '../demanda/demanda.component';
import { FrecuenciaComponent } from '../frecuencia/frecuencia.component';
import { MapCentralesComponent } from '../map-centrales/map-centrales.component';
import { MapTransferenciasComponent } from '../map-transferencias/map-transferencias.component';

@Component({
  selector: 'app-dashboard-map',
  imports: [TabContainerComponent],
  templateUrl: './dashboard-map.component.html',
  styleUrl: './dashboard-map.component.css'
})
export class DashboardMapComponent {

  // Tabs de la columna izquierda
    leftTabs = [
      { label: 'Generación de Energía', component: GeneradaComponent },
      { label: 'Demanda de Energía', component: DemandaComponent },
      { label: 'Frecuencia', component: FrecuenciaComponent }
      
    ];
    // Tabs de la columna derecha
    rightTabs = [
      { label: 'Centrales', component: MapCentralesComponent },
      { label: 'Transferencias', component: MapTransferenciasComponent }
    ];

}

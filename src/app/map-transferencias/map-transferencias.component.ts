import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LiveDataService } from '../services/live-data.service'

type RegionKey = 'norte' | 'este' | 'sur';

interface LineData {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  inject: string;
  flujo_activo: String;
  flujo_reactivo: String;
  info: string;
  animation: {
    duration: string;
    invert: boolean;
    begin: string[];
  };
}

@Component({
  selector: 'app-map-transferencias',
  templateUrl: './map-transferencias.component.html',
  styleUrls: ['./map-transferencias.component.css']
})
export class MapTransferenciasComponent implements OnInit {
  
  frequency: string = '0 Hz';
  dateTime: string = '';
  
  data: { lines: LineData[] } = {
    lines: []
  };

  regionColors = {
    norte: '#ffcc00',
    este: '#00ccff',
    sur: '#ff6666'
  };

  private predefinedCircles = [
    { cx: 287, cy: 466, r: 4 },
    { cx: 166, cy: 405, r: 4 },
    { cx: 333, cy: 293, r: 4 },
    { cx: 156, cy: 154, r: 4 },
    { cx: 226, cy: 497, r: 4 },
    { cx: 355, cy: 558, r: 4 },
    { cx: 293, cy: 582, r: 4 },
    { cx: 363, cy: 682, r: 4 },
    { cx: 460, cy: 485, r: 4 }
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private liveDataService: LiveDataService
  ) { }

  ngOnInit(): void {
    this.liveDataService.getLiveData().subscribe(data => {
  this.frequency = `${data.frequency.toFixed(2)} Hz`; // 2 decimales
  this.dateTime = new Date(data.timestamp).toLocaleString('es-BO'); // hora local
});

    // this.fetchData();
    this.loadFallbackData();
  }

  
  private fetchData(): void {
    this.http.get<any[]>('https://190.181.35.6:5001/WebApiRTransferencias').subscribe({
      next: (apiResponse) => {
        this.data.lines = this.mapApiResponse(apiResponse);
        console.log('respuesta', apiResponse)
        this.cdr.detectChanges();
        setTimeout(() => {
          this.initMap();
          this.addHoverEffects();
        }, 100);
      },
      error: (error) => {
        console.error('Error:', error);
        // this.loadFallbackData();
      }
    });
  }

  private mapApiResponse(apiData: any[]): LineData[] {
    return apiData.map(item => ({
      id: item.id,
      start: item.start,
      end: item.end,
      flujo_activo: item.flujo_activo,
      flujo_reactivo: item.flujo_reactivo,
      inject: item.inject,
      info: item.info,
      animation: {
        duration: item.animation.duration,
        invert: item.animation.invert,
        begin: item.animation.begin
      }
    }));
  }

  private initMap(): void {
    const svg = document.getElementById('map-svg');
    if (!svg) return;

    // this.clearExistingElements(svg);
    this.createStaticCircles(svg);
    this.createDynamicElements(svg);
  }


  private createStaticCircles(svg: HTMLElement): void {
    this.predefinedCircles.forEach(circle => {
      const circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circleElement.setAttribute('cx', circle.cx.toString());
      circleElement.setAttribute('cy', circle.cy.toString());
      circleElement.setAttribute('r', circle.r.toString());
      circleElement.setAttribute('fill', '#000000');
      svg.appendChild(circleElement);
    });
  }

  private createDynamicElements(svg: HTMLElement): void {
    this.data.lines.forEach(line => {
      this.createLine(svg, line);
      this.createAnimatedCircles(svg, line);
    });
  }

  private createLine(svg: HTMLElement, line: LineData): void {
    // Calcular la dirección de la línea
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    // Calcular el vector unitario en la dirección de la línea
    const ux = dx / length;
    const uy = dy / length;

    // Ajustar los puntos de inicio y final para reducir la longitud
    const offset = 5;
    const { newStartX, newStartY, newEndX, newEndY } = this.calculateAdjustedPoints(line, ux, uy, offset);

    // Crear la línea con los nuevos puntos
    const lineElement = this.createLineElement(line, newStartX, newStartY, newEndX, newEndY);

    // Crear la punta de la flecha en el nuevo final de la línea
    const arrowHead = this.createArrowHead(svg, line, newStartX, newStartY, newEndX, newEndY);

    // Agregar eventos hover para cambiar el color de la línea y la cabeza de la flecha
    this.addLineHoverEffects(lineElement, arrowHead, line);

    svg.appendChild(lineElement);
}

private calculateAdjustedPoints(line: LineData, ux: number, uy: number, offset: number): {
    newStartX: number;
    newStartY: number;
    newEndX: number;
    newEndY: number;
} {
    let newStartX, newStartY, newEndX, newEndY;

    if (line.animation.invert) {
        newStartX = line.start.x + ux * offset * 2;
        newStartY = line.start.y + uy * offset * 2;
        newEndX = line.end.x - ux * offset;
        newEndY = line.end.y - uy * offset;
    } else {
        newStartX = line.start.x + ux * offset;
        newStartY = line.start.y + uy * offset;
        newEndX = line.end.x - ux * offset * 2;
        newEndY = line.end.y - uy * offset * 2;
    }

    return { newStartX, newStartY, newEndX, newEndY };
}

private createLineElement(line: LineData, newStartX: number, newStartY: number, newEndX: number, newEndY: number): SVGLineElement {
    const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineElement.setAttribute('id', line.id);
    lineElement.setAttribute('x1', newStartX.toString());
    lineElement.setAttribute('y1', newStartY.toString());
    lineElement.setAttribute('x2', newEndX.toString());
    lineElement.setAttribute('y2', newEndY.toString());
    lineElement.setAttribute('class', 'line');
    lineElement.setAttribute('stroke', 'gray');
    lineElement.setAttribute('stroke-width', '5');
    lineElement.setAttribute('data-info', line.info);

    return lineElement;
}

private createArrowHead(svg: HTMLElement, line: LineData, newStartX: number, newStartY: number, newEndX: number, newEndY: number): SVGPolygonElement {
    const arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    // Definir los puntos del triángulo (punta de flecha) centrado
    const arrowPoints = "0,-6.666 -5,3.333 5,3.333"; // Triángulo centrado
    arrowHead.setAttribute('points', arrowPoints);

    // Calcular la dirección de la línea
    const dx = line.end.x - line.start.x;
    const dy = line.end.y - line.start.y;

    // Calcular el ángulo de la línea
    let angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convertir a grados

    // Si invert es true, rotar la flecha 180 grados para que apunte en sentido contrario
    if (line.animation.invert) {
        angle += 180; // Rotar 180 grados
    }

    // Ajustar la posición de la punta de la flecha
    const arrowPositionX = line.animation.invert ? newStartX : newEndX;
    const arrowPositionY = line.animation.invert ? newStartY : newEndY;

    // Aplicar transformación para posicionar y rotar la punta de la flecha
    arrowHead.setAttribute(
        'transform',
        `translate(${arrowPositionX},${arrowPositionY}) rotate(${angle + 90})` // Ajustar el ángulo para que apunte correctamente
    );
    arrowHead.setAttribute('fill', 'grey'); // Color de la punta de la flecha

    svg.appendChild(arrowHead);

    return arrowHead;
}

private addLineHoverEffects(lineElement: SVGLineElement, arrowHead: SVGPolygonElement, line: LineData): void {
  lineElement.addEventListener('mouseenter', () => {
      lineElement.setAttribute('stroke', 'orange'); // Cambiar color de la línea
      arrowHead.setAttribute('fill', 'orange'); // Cambiar color de la cabeza de la flecha
  });

  lineElement.addEventListener('mouseleave', () => {
      lineElement.setAttribute('stroke', 'gray'); // Restaurar color de la línea
      arrowHead.setAttribute('fill', 'grey'); // Restaurar color de la cabeza de la flecha
  });

  lineElement.addEventListener('mouseover', (e) => {
      // Modificar el contenido de line.info si line.animation.invert es true
      let info = line.info;
      if (line.animation.invert) {
          const parts = info.split(' - '); // Dividir el texto en partes
          if (parts.length === 2) {
              info = `${parts[1]} - ${parts[0]}`; // Invertir las partes
          }
      }

      // Mostrar el tooltip con la información modificada
      this.showTooltip(e, line.inject, info, line.flujo_activo, line.flujo_reactivo);
  });

  lineElement.addEventListener('mousemove', (e) => this.moveTooltip(e));
  lineElement.addEventListener('mouseout', () => this.hideTooltip());
}



  private createAnimatedCircles(svg: HTMLElement, line: LineData): void {
    const circleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (let i = 0; i < 3; i++) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const radius = 2; // Radio del círculo
        const position = this.calculateCirclePosition(line, i); // Calcula la posición inicial

        circle.setAttribute('cx', position.x.toString());
        circle.setAttribute('cy', position.y.toString());
        circle.setAttribute('r', radius.toString());
        circle.setAttribute('fill', 'yellow');

        this.addCircleAnimation(circle, line, i); // Añade la animación
        circleGroup.appendChild(circle);
    }

    svg.appendChild(circleGroup);
}

private calculateCirclePosition(line: LineData, index: number): { x: number; y: number } {
    // Calcula la posición inicial del círculo a lo largo de la línea
    const t = index / 3; // Divide la línea en 3 segmentos
    return {
        x: line.start.x + t * (line.end.x - line.start.x),
        y: line.start.y + t * (line.end.y - line.start.y)
    };
}

private addCircleAnimation(circle: SVGCircleElement, line: LineData, index: number): void {
  // Determinar las coordenadas de inicio y fin basadas en la propiedad `invert`
  const fromX = line.animation.invert ? line.end.x : line.start.x;
  const fromY = line.animation.invert ? line.end.y : line.start.y;
  const toX = line.animation.invert ? line.start.x : line.end.x;
  const toY = line.animation.invert ? line.start.y : line.end.y;

  // Animación para el atributo `cx`
  const animateX = document.createElementNS("http://www.w3.org/2000/svg", "animate");
  animateX.setAttribute('attributeName', 'cx');
  animateX.setAttribute('from', fromX.toString());
  animateX.setAttribute('to', toX.toString());
  animateX.setAttribute('dur', line.animation.duration);
  animateX.setAttribute('begin', line.animation.begin[index]);
  animateX.setAttribute('repeatCount', 'indefinite');
  circle.appendChild(animateX);

  // Animación para el atributo `cy`
  const animateY = document.createElementNS("http://www.w3.org/2000/svg", "animate");
  animateY.setAttribute('attributeName', 'cy');
  animateY.setAttribute('from', fromY.toString());
  animateY.setAttribute('to', toY.toString());
  animateY.setAttribute('dur', line.animation.duration);
  animateY.setAttribute('begin', line.animation.begin[index]);
  animateY.setAttribute('repeatCount', 'indefinite');
  circle.appendChild(animateY);
}

private showTooltip(event: MouseEvent, text: String, info: String, activo: String, reactivo: String): void {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) {
      tooltip.innerHTML = `
          <div class="tooltip-title">
              <b>${info}</b>
          </div>
          <div class="tooltip-row">
              <b>Transferencia:</b><span>${text}</span>
          </div>
          <div class="tooltip-row">
              <b>Potencia activa:</b><span>${activo}</span>
          </div>
          <div class="tooltip-row">
              <b>Potencia reactiva:</b><span>${reactivo}</span>
          </div>
      `;

      // Mostrar tooltip
      tooltip.style.opacity = '1';

      // Calcular límites del viewport
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;

      let left = event.pageX + 10; // Posición por defecto a la derecha del cursor
      let top = event.pageY + 10;  // Posición por defecto debajo del cursor

      // Ajustar si excede los límites horizontales
      if (left + tooltipWidth > pageWidth) {
          left = pageWidth - tooltipWidth - 10; // Mueve el tooltip hacia la izquierda
      }

      // Ajustar si excede los límites verticales
      if (top + tooltipHeight > pageHeight) {
          top = pageHeight - tooltipHeight - 10; // Mueve el tooltip hacia arriba
      }

      // Ajustar estilos del tooltip
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
  }
}


  private moveTooltip(event: MouseEvent): void {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
    }
  }

  private hideTooltip(): void {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) tooltip.style.opacity = '0';
  }

  private addHoverEffects(): void {
    const regions = ['norte', 'este', 'sur'];
    regions.forEach(region => {
      const elements = document.querySelectorAll(`g.${region}`);
      elements.forEach(el => {
        el.addEventListener('mouseenter', () => 
          this.changeRegionColor(region as RegionKey, this.regionColors[region as RegionKey]));
        el.addEventListener('mouseleave', () => 
          this.changeRegionColor(region as RegionKey, '#d9d9d9'));
      });
    });
  }

  private changeRegionColor(region: RegionKey, color: string): void {
    const paths = document.querySelectorAll(`g.${region} path`);
    paths.forEach(path => {
      (path as SVGPathElement).setAttribute('fill', color);
    });
  }


  private loadFallbackData(): void {
    this.data.lines = [
      {
        "id": "lp-cb",
        "start": {"x": 166, "y": 405},
        "end": {"x": 286, "y": 466},
        "inject": "355.020 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "La Paz - Cochabamba",
        "animation": {
            "duration": "2s",
            "invert": true,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "lp-or",
        "start": {"x": 166, "y": 405},
        "end": {"x": 226, "y": 497},
        "inject": "55.520 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "La Paz - Oruro",
        "animation": {
            "duration": "2s",
            "invert": true,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "lp-tr",
        "start": {"x": 166, "y": 405},
        "end": {"x": 333, "y": 293},
        "inject": "20.200 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "La Paz - Trinidad",
        "animation": {
            "duration": "2s",
            "invert": true,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "cb-sc",
        "start": {"x": 288, "y": 467},
        "end": {"x": 460, "y": 485},
        "inject": "425.010 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "Cochabamba - Santa Cruz",
        "animation": {
            "duration": "2s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "cb-or",
        "start": {"x": 287, "y": 467},
        "end": {"x": 227, "y": 497},
        "inject": "165.080 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "Cochabamba - Oruro",
        "animation": {
            "duration": "1s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "cb-pt",
        "start": {"x": 287, "y": 467},
        "end": {"x": 293, "y": 582},
        "inject": "135.010 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "Cochabamba - Potosí",
        "animation": {
            "duration": "2s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "cb-ch",
        "start": {"x": 287, "y": 467},
        "end": {"x": 355, "y": 558},
        "inject": "105.090 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "Cochabamba - Sucre",
        "animation": {
            "duration": "2s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "or-pt",
        "start": {"x": 227, "y": 497},
        "end": {"x": 293, "y": 582},
        "inject": "35.500 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "Oruro - Potosí",
        "animation": {
            "duration": "2s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "pt-ch",
        "start": {"x": 293, "y": 582},
        "end": {"x": 355, "y": 558},
        "inject": "25.420 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "Potosí - Sucre",
        "animation": {
            "duration": "1s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "pt-ta",
        "start": {"x": 293, "y": 582},
        "end": {"x": 363, "y": 682},
        "inject": "135.300 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "Potosí - Tarija",
        "animation": {
            "duration": "2s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "sc-tr",
        "start": {"x": 460, "y": 485},
        "end": {"x": 333, "y": 293},
        "inject": "355.020 Kw/h",
        "flujo_activo": "23.000 MW",
        "flujo_reactivo": "7.000 Mvar",
        "info": "Santa Cruz - Trinidad",
        "animation": {
            "duration": "2s",
            "invert": true,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    }
    ];
    this.cdr.detectChanges();
    setTimeout(() => this.initMap(), 100);
  }
}

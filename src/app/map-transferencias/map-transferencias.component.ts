import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type RegionKey = 'norte' | 'este' | 'sur';

interface LineData {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  inject: string;
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
  data: { lines: LineData[] } = {
    lines: []
  };

  regionColors = {
    norte: '#ffcc00',
    este: '#00ccff',
    sur: '#ff6666'
  };

  private predefinedCircles = [
    { cx: 286, cy: 466.23, r: 4 },
    { cx: 166.52, cy: 386.93, r: 4 },
    { cx: 333.50, cy: 293.60, r: 4 },
    { cx: 156.00, cy: 154.25, r: 4 },
    { cx: 226.82, cy: 497.38, r: 4 },
    { cx: 355.39, cy: 558.00, r: 4 },
    { cx: 293.37, cy: 582.23, r: 4 },
    { cx: 363.13, cy: 682.48, r: 4 },
    { cx: 474.30, cy: 514.55, r: 4 }
  ];

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.fetchData();
    // this.loadFallbackData();
  }

  private fetchData(): void {
    this.http.get<any[]>('https://190.181.35.6:5000/WebApiRTransferencias').subscribe({
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
    this.createDynamicElements(svg);
    this.createStaticCircles(svg);
  }

  private clearExistingElements(svg: HTMLElement): void {
    ['line', 'g', 'polygon'].forEach(tag => {
      const elements = svg.getElementsByTagName(tag);
      // while (elements.length > 0) elements[0].remove();
    });
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
    // Crear la línea
    const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lineElement.setAttribute('id', line.id);
    lineElement.setAttribute('x1', line.start.x.toString());
    lineElement.setAttribute('y1', line.start.y.toString());
    lineElement.setAttribute('x2', line.end.x.toString());
    lineElement.setAttribute('y2', line.end.y.toString());
    lineElement.setAttribute('class', 'line');
    lineElement.setAttribute('stroke', 'gray');
    lineElement.setAttribute('stroke-width', '5');
    lineElement.setAttribute('data-info', line.info);

    lineElement.addEventListener('mouseover', (e) => this.showTooltip(e, line.info));
    lineElement.addEventListener('mousemove', (e) => this.moveTooltip(e));
    lineElement.addEventListener('mouseout', () => this.hideTooltip());

    svg.appendChild(lineElement);

    // Crear la punta de la flecha
    this.createArrowHead(svg, line);
}

private createArrowHead(svg: HTMLElement, line: LineData): void {
  const arrowHead = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

  // Definir los puntos del triángulo (punta de flecha) centrado
  const arrowPoints = "0,-6.666 -5,3.333 5,3.333"; // Triángulo centrado
  arrowHead.setAttribute('points', arrowPoints);

  // Calcular la posición y el ángulo de la punta de la flecha
  const angle = this.calculateLineAngle(line); // Ángulo de la línea
  const position = line.animation.invert ? line.start : line.end; // Posición de la punta

  // Depuración: Verificar posición y ángulo
  console.log('Posición de la punta:', position);
  console.log('Ángulo de la punta:', angle);

  // Aplicar transformación para posicionar y rotar la punta de la flecha
  arrowHead.setAttribute(
      'transform',
      `translate(${position.x},${position.y}) rotate(${angle})`
  );
  arrowHead.setAttribute('fill', 'grey'); // Color de la punta de la flecha

  svg.appendChild(arrowHead);
}

private calculateLineAngle(line: LineData): number {
  const dx = line.end.x - line.start.x;
  const dy = line.end.y - line.start.y;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Convertir a grados

  // Ajustar el ángulo para que el triángulo apunte en la dirección correcta
  const adjustedAngle = angle + 90;

  // Ajustar el ángulo si la animación está invertida
  return line.animation.invert ? adjustedAngle + 180 : adjustedAngle;
}

private calculateArrowPosition(line: LineData): { x: number; y: number } {
  const offset = 10; // Ajusta este valor para mover la flecha más o menos
  const dx = line.end.x - line.start.x;
  const dy = line.end.y - line.start.y;
  const length = Math.sqrt(dx * dx + dy * dy); // Longitud de la línea
  const ratio = (length - offset) / length; // Proporción para mover la flecha

  // Calcular la posición de la flecha
  return {
      x: line.start.x + dx * ratio,
      y: line.start.y + dy * ratio
  };
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

  private showTooltip(event: MouseEvent, text: string): void {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
      tooltip.innerHTML = `<b>${text}</b>`;
      tooltip.style.opacity = '1';
      tooltip.style.left = `${event.pageX + 10}px`;
      tooltip.style.top = `${event.pageY + 10}px`;
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
        id: "cb-lp",
        start: { x: 169, y: 387 },
        end: { x: 283, y: 464.5 },
        inject: "355.020 Kwh",
        info: "Línea Cochabamba - La Paz",
        animation: {
          duration: "2s",
          invert: false,
          begin: ["0s", "0.2s", "0.4s"]
        }
      },
      {
        id: "lp-or",
        start: { x: 167, y: 390 },
        end: { x: 226.5, y: 497.5 },
        inject: "55.520 Kwh",
        info: "Línea La Paz - Oruro",
        animation: {
          duration: "2s",
          invert: true,
          begin: ["0s", "0.2s", "0.4s"]
        }
      }
    ];
    this.cdr.detectChanges();
    setTimeout(() => this.initMap(), 100);
  }
}

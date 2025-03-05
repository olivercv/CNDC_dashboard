import { Component, OnInit } from '@angular/core';

type RegionKey = 'norte' | 'este' | 'sur';

@Component({
  selector: 'app-map-transferencias',
  imports: [],
  templateUrl: './map-transferencias.component.html',
  styleUrl: './map-transferencias.component.css'
})
export class MapTransferenciasComponent implements OnInit {

  data = {
    "lines": [
      {
        "id": "cb-lp",
        "start": {"x": 169, "y": 387},
        "end": {"x": 283, "y": 464.5},
        "inject": "355.020 Kwh",
        "info": "Línea Cochabamba - La Paz",
        "animation": {
            "duration": "2s",
            "invert": true,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "lp-or",
        "start": {"x": 167, "y": 390},
        "end": {"x": 226.5, "y": 497.5},
        "inject": "55.520 Kwh",
        "info": "Línea La Paz - Oruro",
        "animation": {
            "duration": "2s",
            "invert": true,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "lp-tr",
        "start": {"x": 167, "y": 386},
        "end": {"x": 333.5, "y": 293.5},
        "inject": "20.200 Kwh",
        "info": "Línea La Paz - Trinidad",
        "animation": {
            "duration": "2s",
            "invert": true,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "cb-sc",
        "start": {"x": 288, "y": 467},
        "end": {"x": 474, "y": 515},
        "inject": "425.010 Kwh",
        "info": "Línea Cochabamba - Santa Cruz",
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
        "info": "Línea Cochabamba - Oruro",
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
        "inject": "135.010 Kwh",
        "info": "Línea Cochabamba - Potosí",
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
        "inject": "105.090 Kwh",
        "info": "Línea Cochabamba - Sucre",
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
        "inject": "35.500 Kwh",
        "info": "Línea Oruro - Potosí",
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
        "inject": "25.420 Kwh",
        "info": "Línea Potosí - Sucre",
        "animation": {
            "duration": "1s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "pt-ta",
        "start": {"x": 293, "y": 582},
        "end": {"x": 363, "y": 682.5},
        "inject": "135.300 Kwh",
        "info": "Línea Potosí - Tarija",
        "animation": {
            "duration": "2s",
            "invert": false,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    },
    {
        "id": "sc-tr",
        "start": {"x": 476.5, "y": 515},
        "end": {"x": 333.5, "y": 293.5},
        "inject": "355.020 Kwh",
        "info": "Línea Santa Cruz - Trinidad",
        "animation": {
            "duration": "2s",
            "invert": true,
            "begin": ["0s", "0.2s", "0.4s"]
        }
    }
    ]
  };

  regionColors = {
    norte: '#ffcc00',
    este: '#00ccff',
    sur: '#ff6666'
  };

  constructor() { }

  ngOnInit(): void {
    this.initMap();
    this.addHoverEffects();
  }

  initMap(): void {
    const tooltip = document.getElementById('tooltip');
    const svg = document.getElementById('map-svg');
    if (!tooltip || !svg) {
      console.error('No se encontró el tooltip o el SVG en el DOM.');
      return;
    }

    this.data.lines.forEach(line => {
      const { id, start, end, info, inject, animation } = line;
      const isInverted = animation.invert;
      const animationStart = isInverted ? end : start;
      const animationEnd = isInverted ? start : end;

      const lineElement = document.createElementNS("http://www.w3.org/2000/svg", "line");
      lineElement.setAttribute("id", id);
      lineElement.setAttribute("x1", start.x.toString());
      lineElement.setAttribute("y1", start.y.toString());
      lineElement.setAttribute("x2", end.x.toString());
      lineElement.setAttribute("y2", end.y.toString());
      lineElement.setAttribute("class", "line");
      lineElement.setAttribute("stroke", "gray");
      lineElement.setAttribute("stroke-width", "5");
      lineElement.setAttribute("data-info", info);
      svg.appendChild(lineElement);

      lineElement.addEventListener('mouseover', (event) => {
        tooltip.innerHTML = `<b>${inject}</b>`;
        tooltip.style.opacity = '1';
      });

      lineElement.addEventListener('mousemove', (event) => {
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
      });

      lineElement.addEventListener('mouseout', () => {
        tooltip.style.opacity = '0';
      });

      const triangleGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const numTriangles = 3;

      for (let i = 0; i < numTriangles; i++) {
        const t = i / (numTriangles - 1);
        const { x, y } = this.calculatePointOnLine(animationStart, animationEnd, t);
        const triangle = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        triangle.setAttribute("points", "-1.666,-2.5 3.333,0 -1.666,2.5"); // Triángulo centrado
        triangle.setAttribute("fill", "yellow");

        // Calcular el ángulo de rotación
        const angle = this.calculateAngle(start, end, isInverted);

        // Aplicar la rotación y la traslación
        triangle.setAttribute("transform", `translate(${x},${y}) rotate(${angle})`);

        // Animación de traslación
        const animateTranslate = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
        animateTranslate.setAttribute("attributeName", "transform");
        animateTranslate.setAttribute("type", "translate");
        animateTranslate.setAttribute("from", `${animationStart.x} ${animationStart.y}`);
        animateTranslate.setAttribute("to", `${animationEnd.x} ${animationEnd.y}`);
        animateTranslate.setAttribute("dur", animation.duration);
        animateTranslate.setAttribute("begin", animation.begin[i]);
        animateTranslate.setAttribute("repeatCount", "indefinite");
        triangle.appendChild(animateTranslate);

        triangleGroup.appendChild(triangle);
      }

      svg.appendChild(triangleGroup);
    });

    const predefinedCircles: { cx: number; cy: number; r: number }[] = [
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

    predefinedCircles.forEach(circleData => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", circleData.cx.toString());
      circle.setAttribute("cy", circleData.cy.toString());
      circle.setAttribute("r", circleData.r.toString());
      circle.setAttribute("fill", "#000000");
      circle.setAttribute("fill-opacity", "1");
      svg.appendChild(circle);
    });
  }

  calculateAngle(start: { x: number, y: number }, end: { x: number, y: number }, invert: boolean): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI); // Ángulo en grados
    return invert ? angle + 180 : angle; // Invertir el ángulo si es necesario
  }

  calculatePointOnLine(start: { x: number, y: number }, end: { x: number, y: number }, t: number): { x: number, y: number } {
    const x = start.x + t * (end.x - start.x);
    const y = start.y + t * (end.y - start.y);
    return { x, y };
  }

  addHoverEffects(): void {
    const svg = document.getElementById('map-svg');
    if (!svg) {
      console.error('No se encontró el SVG en el DOM.');
      return;
    }

    // Seleccionar todos los grupos (norte, este, sur)
    const regions = svg.querySelectorAll('g.norte, g.este, g.sur');

    regions.forEach(region => {
      // Evento hover
      region.addEventListener('mouseenter', () => {
        const className = region.classList[0] as RegionKey; // Asegurar que className sea una clave válida
        this.changeRegionColor(className, this.regionColors[className]);
      });

      region.addEventListener('mouseleave', () => {
        const className = region.classList[0] as RegionKey; // Asegurar que className sea una clave válida
        this.changeRegionColor(className, '#d9d9d9'); // Restaurar color inicial
      });
    });
  }

  changeRegionColor(className: RegionKey, color: string): void {
    const paths = document.querySelectorAll(`g.${className} path`);
    paths.forEach(path => {
      (path as SVGPathElement).setAttribute('fill', color);
    });
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTransferenciasComponent } from './map-transferencias.component';

describe('MapTransferenciasComponent', () => {
  let component: MapTransferenciasComponent;
  let fixture: ComponentFixture<MapTransferenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapTransferenciasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapTransferenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

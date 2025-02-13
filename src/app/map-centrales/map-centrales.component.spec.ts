import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCentralesComponent } from './map-centrales.component';

describe('MapCentralesComponent', () => {
  let component: MapCentralesComponent;
  let fixture: ComponentFixture<MapCentralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapCentralesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapCentralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

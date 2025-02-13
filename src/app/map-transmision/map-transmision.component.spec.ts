import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTransmisionComponent } from './map-transmision.component';

describe('MapTransmisionComponent', () => {
  let component: MapTransmisionComponent;
  let fixture: ComponentFixture<MapTransmisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapTransmisionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapTransmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

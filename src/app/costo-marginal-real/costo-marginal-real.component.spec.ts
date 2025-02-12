import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostoMarginalRealComponent } from './costo-marginal-real.component';

describe('CostoMarginalRealComponent', () => {
  let component: CostoMarginalRealComponent;
  let fixture: ComponentFixture<CostoMarginalRealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostoMarginalRealComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostoMarginalRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

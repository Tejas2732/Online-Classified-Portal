import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellProduct } from './sell-product';

describe('SellProduct', () => {
  let component: SellProduct;
  let fixture: ComponentFixture<SellProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

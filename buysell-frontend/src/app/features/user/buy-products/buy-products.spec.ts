import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyProducts } from './buy-products';

describe('BuyProducts', () => {
  let component: BuyProducts;
  let fixture: ComponentFixture<BuyProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyProducts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

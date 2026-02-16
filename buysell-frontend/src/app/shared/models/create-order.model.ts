export interface CreateOrderRequest {
    productId: number;
    quantity: number;
    paymentMethod: 'WALLET' | 'CARD';
    cardDetails?: {
      cardNumber: string;
      cardHolderName: string;
      expiry: string;
      cvv: string;
    };
  }
  
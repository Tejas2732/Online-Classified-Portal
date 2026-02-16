export interface CardPaymentDetails {
    cardNumber: string;
    cardHolderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
  }
  
  export interface Order {
    id: number;
    orderNumber: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    paymentMethod: 'WALLET' | 'CARD';
    status: 'COMPLETED' | 'CANCELLED';
    createdAt: string;
  }
  
  
  export interface CreateOrderRequest {
    productId: number;
    quantity: number;
    paymentMethod: 'WALLET' | 'CARD';
    cardDetails?: CardPaymentDetails;
  }
  
  export interface OrderReceipt {
    orderNumber: string;
    buyerName: string;
    productName: string;
    totalAmount: number;
    quantity: number;
    paymentMethod: string;
    orderDate: string;
    receiptUrl: string;
  }
  
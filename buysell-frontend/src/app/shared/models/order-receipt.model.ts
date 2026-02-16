export interface OrderReceipt {
    orderNumber: string;
    buyerName: string;
    productName: string;
    quantity: number;
    totalAmount: number;
    paymentMethod: string;
    orderDate: string;
    receiptUrl: string;
  }
  
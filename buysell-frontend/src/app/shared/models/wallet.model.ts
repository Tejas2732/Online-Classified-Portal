export interface Wallet {
    id: number;
    balance: number;
  }
  
  export interface Transaction {
    id: number;
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    balanceAfter: number;
    description: string;
    createdAt: string;
  }
  
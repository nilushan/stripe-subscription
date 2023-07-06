export interface Product {
  id: string;
  name: string;
  description: string;
}

export interface Products{
  products: Product[];
}

export interface Price {
  id: string;
  product: string;
  billing_scheme: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: string;
    interval_count: number;
  };
}

export interface Prices {
  prices: Price[];
}

export interface ProductAndPrices {
  product: Product;
  prices: Price[];
}

export interface ProductsAndPrices {
  productsAndPrices: ProductAndPrices[];
}

export interface Subscription {
  id: string;
  productId: string;
  customerId: string;
  startDate: Date;
  endDate: Date;
}


export interface PaymentIntentResponse{
  clientSecret: string;
  id: string;
  amount: number;
  currency: string;
  customer?: string;
}
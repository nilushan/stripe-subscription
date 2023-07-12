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
  metadata: { key: string, value: string }[];
  latest_invoice: LatestInvoice;

}

export interface LatestInvoice {
  id: string;
  account_currency: string;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  attempt_count: number;
  attempted: boolean;
  effective_at: Date;
  hosted_invoice_url: string;
  invoice_pdf: string;
  payment_intent: {
    id: string;
    client_secret: string;
  }

}

export interface Subscriptions {
  data: Subscription[];
}

export interface PaymentIntentResponse{
  clientSecret: string;
  id: string;
  amount: number;
  currency: string;
  customer?: string;
}

export interface Customer {
  id: string;
  default_source: Source;
  email: string;
  name: string;
  
}


export interface Customers {
  data: Customer[];
}

export interface Source {
  id: string;
  card: Card;
  client_secret: string;
  customer: string;

}

export interface Card {
  brand: string;
  country: string;
  exp_month: number;
  exp_year: number;
  last4: string;

}
/* eslint-disable max-len */
import {Stripe} from 'stripe';
import {Configs} from './config';
import {PaymentIntentResponse, Price, Prices, Product,
  ProductAndPrices, Products, ProductsAndPrices} from '../../shared/types';

/**
 * StripeAPI calls the stripe api calls required by the app.
 */
export class StripeAPI {
  private stripe: Stripe;

  /**
   * StripeAPI constructor
   * @constructor
   * @param {string} stripeApiKey - Stripe API key.
   * @throws {Error} If stripeApiKey is not provided.
   * @throws {Error} If stripeApiKey is not a string.
   * @throws {Error} If stripeApiKey is an empty string.
   * @throws {Error} If stripeBackendUrl is not provided.
   * @throws {Error} If stripeBackendUrl is not a string.
   * @throws {Error} If stripeBackendUrl is an empty string.
   * @throws {Error} If stripeApiKey is not a valid Stripe API key.
   * @throws {Error} If stripeBackendUrl is not a valid URL.
   */
  constructor() {
    this.stripe = new Stripe(Configs.stripeApiKey, {apiVersion: '2022-11-15'});
  }

  /**
   * List all active products
   * @return {Promise<Products>}
   */
  public listProducts = (): Promise<Products> => {
    return new Promise<Products>((resolve, reject) => {
      this.stripe.products.list(
          {active: true}
      )
          .then((ret) => {
            // console.log(ret);
            const products = ret.data.map((product) => {
              const mappedProduct: Product = {
                id: product.id,
                name: product.name,
                description: product.description ? product.description : '',
              };
              return mappedProduct;
            });
            resolve({products: products});
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
    });
  };
  /**
 * @function listPricesOfProduct
 * @description List prices of a product
 * @param {string} productId - ID of the product to retrieve the prices for
 * @return {Promise<Prices>} A promise that resolves with the product prices
 */
  public listPricesOfProduct = (productId: string) => {
    return this.stripe.prices.list({
      product: productId,
      active: true,
      limit: 10,
    });
  };

  /**
 * @function listPrices
 * @description List all active prices
 * @return {Promise<Prices>} A promise that resolves with all active prices
 */

  public listPrices = () => {
    return new Promise<Prices>((resolve, reject) => {
      this.stripe.prices.list({
        active: true,
        limit: 30,
      })
          .then((ret) => {
            const prices = ret.data.map((price) => {
              const mappedPrice: Price = {
                id: price.id,
                product: price.product as string,
                billing_scheme: price.billing_scheme,
                unit_amount: price.unit_amount ? price.unit_amount : 0,
                currency: price.currency,
                recurring: {
                  interval: price.recurring?.interval ?
                    price.recurring?.interval : 'none',
                  interval_count: price.recurring?.interval_count ?
                    price.recurring.interval_count : 0,
                },
              };
              return mappedPrice;
            });
            resolve({prices: prices});
          })
          .catch((err) => {
            reject(err);
          });
    });
  };

  /**
 * @function listProductsAndPrices
 * @description List all products and their corresponding prices
 * @return {Promise<ProductsAndPrices>} A promise that resolves with all products and their prices
 */
  public listProductsAndPrices = () => {
    return new Promise<ProductsAndPrices>((resolve, reject) => {
      const prices = this.listPrices();
      const products = this.listProducts();

      Promise.all([prices, products])
          .then((values) => {
            const prices = values[0].prices;
            const products = values[1].products;

            const productsAndPrices: ProductAndPrices[] = products.map((product) => {
              const productPrices = prices.filter((price) => {
                return price.product === product.id;
              });
              return {
                product: product,
                prices: productPrices,
              };
            });

            resolve({productsAndPrices: productsAndPrices});
          }).catch((err) => {
            reject(err);
          });
    });
  };


  /**
 * @function getPrice
 * @description Get the price details for a given price id
 * @param {string} priceid - ID of the price to retrieve
 * @return {Promise<Price>} A promise that resolves with the price details
 */
  public getPrice = (priceid: string) => {
    return new Promise<Price>((resolve, reject) => {
      this.stripe.prices.retrieve(priceid)
          .then((ret) => {
            resolve({
              id: ret.id,
              product: ret.product as string,
              billing_scheme: ret.billing_scheme,
              unit_amount: ret.unit_amount ? ret.unit_amount : 0,
              currency: ret.currency,
              recurring: {
                interval: ret.recurring?.interval ? ret.recurring?.interval : 'none',
                interval_count: ret.recurring?.interval_count ? ret.recurring.interval_count : 0,
              },
            });
          })
          .catch((err) => {
            reject(err);
          });
    });
  };


  /**
 * @function createSubscription
 * @description Create a subscription for a customer with a specific price
 * @param {string} customerId - ID of the customer to create the subscription for
 * @param {string} priceId - ID of the price for the subscription
 * @return {Promise<Stripe.Response<Stripe.Subscription>>} A promise that resolves with the created subscription
 */
  public createSubscription = (customerId: string, priceId: string) => {
    return this.stripe.subscriptions.create({
      customer: customerId,
      items: [{price: priceId}],
      // default_payment_method: 'card',
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      payment_settings: {save_default_payment_method: 'on_subscription'},
      metadata: {
        'customer_id': customerId,
        'network_id': 'ziminetworkguid-a',
      },
    });
  };


  /**
 * @function cancelSubscription
 * @description Cancel a subscription
 * @param {string} subscriptionId - ID of the subscription to cancel
 * @return {Promise<Stripe.Response<Stripe.DeletedSubscription>>} A promise that resolves when the subscription is cancelled
 */

  public cancelSubscription = (subscriptionId: string) => {
    return this.stripe.subscriptions.del(subscriptionId);
  };

  /**
 * @function getSusbcriptions
 * @param {string} customerId
 * @return {Subscriptions} subscriptions for the customer
 */
  public getSusbcriptions = (customerId: string) => {
    return this.stripe.subscriptions.list({
      customer: customerId,
      expand: ['data.latest_invoice.payment_intent'],
    });
  };


  /**
 * @function createCustomer
 * @description Create a new customer
 * @param {string} email - Email of the new customer
 * @param {string} name - Name of the new customer
 * @return {Promise<Stripe.Response<Stripe.Customer>>} A promise that resolves with the created customer
 */
  public createCustomer = (email: string, name: string) => {
    return this.stripe.customers.create({
      email: email,
      name: name,
    });
  };

  /**
   * @function getCustomer
   * @description Get a customer by ID
   * @param {string} email - email of the customer to retrieve
   * @return {Promise<Stripe.Response<Stripe.Customer>>} A promise that resolves with the customer details
   */

  public getCustomerByEmail = (email: string) => {
    return this.stripe.customers.list({
      email: email,
      expand: ['data.default_source'],
    });
  };


  /**
   * @function createPaymentIntent
   * @param {number} amount
   * @param {string} customerId
   * @return {Promise<PaymentIntentResponse>}
   */
  public createPaymentIntent(amount: number, customerId: string) {
    return new Promise<PaymentIntentResponse>((resolve, reject) => {
      this.stripe.paymentIntents.create({
        amount: amount,
        currency: 'aud',
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
      })
          .then((ret) => {
            resolve({
              clientSecret: ret.client_secret ? ret.client_secret : '',
              id: ret.id,
              amount: ret.amount,
              currency: ret.currency,
              // customer: ret.customer,
            });
          })
          .catch((err) => {
            reject(err);
          });
    });
  }

  /**
 * @function createPaymentMethod
 * @description Create a new payment method
 * @param {string} card - Token of the card to create the payment method for
 * @return {Promise<Stripe.Response<Stripe.PaymentMethod>>} A promise that resolves with the created payment method
 */
  public createPaymentMethod = (card: string) => {
    return this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        token: card,
      },
    });
  };
}

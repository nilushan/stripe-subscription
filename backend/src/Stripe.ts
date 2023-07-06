import { Stripe } from 'stripe'
import { Configs } from './config';
import { PaymentIntentResponse, Price, Prices, Product, ProductAndPrices, Products, ProductsAndPrices } from '../../shared/types'

export class StripeAPI {

    private stripe: Stripe;
    constructor() {
        this.stripe = new Stripe(Configs.stripeApiKey, { apiVersion: '2022-11-15' });
    }

    public listProducts = (): Promise<Products> => {
        return new Promise<Products>((resolve, reject) => {
            this.stripe.products.list(
                { active: true}
            )
                .then(ret => {
                    // console.log(ret);
                    const products = ret.data.map(product => {
                        const mappedProduct: Product = {
                            id: product.id,
                            name: product.name,
                            description: product.description ? product.description : ''
                        }
                        return mappedProduct;
                    })
                    resolve({ products: products });
                })
        })
    }

    public listPricesOfProduct = (productId: string) => {

        return this.stripe.prices.list({
            product: productId,
            active: true,
            limit: 10,
        });
    }

    public listPrices = () => {

        return new Promise<Prices>((resolve, reject) => {
            this.stripe.prices.list({
                active: true,
                limit: 30,
            })
                .then(ret => {
                    const prices = ret.data.map(price => {
                        const mappedPrice: Price = {
                            id: price.id,
                            product: price.product as string,
                            billing_scheme: price.billing_scheme,
                            unit_amount: price.unit_amount ? price.unit_amount : 0,
                            currency: price.currency,
                            recurring: {
                                interval: price.recurring?.interval ? price.recurring?.interval : 'none',
                                interval_count: price.recurring?.interval_count ? price.recurring.interval_count : 0,
                            }
                        }
                        return mappedPrice;
                    })
                    resolve({ prices: prices });
                })
                .catch(err => {
                    reject(err);
                })

        });
    }

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
                        }
                    });

                    resolve({ productsAndPrices: productsAndPrices });
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    public getPrice = (priceid: string) => {
        return new Promise<Price>((resolve, reject) => {
            this.stripe.prices.retrieve(priceid)
                .then(ret => {
                    resolve({
                        id: ret.id,
                        product: ret.product as string,
                        billing_scheme: ret.billing_scheme,
                        unit_amount: ret.unit_amount ? ret.unit_amount : 0,
                        currency: ret.currency,
                        recurring: {
                            interval: ret.recurring?.interval ? ret.recurring?.interval : 'none',
                            interval_count: ret.recurring?.interval_count ? ret.recurring.interval_count : 0,
                        }
                    })

                })
                .catch(err => {
                    reject(err);
                });
        })



    }

    public createSubscription = (customerId: string, priceId: string) => {
        return this.stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
        });
    }

    public cancelSubscription = (subscriptionId: string) => {
        return this.stripe.subscriptions.del(subscriptionId);
    }

    public createCustomer = (email: string, name: string) => {
        return this.stripe.customers.create({
            email: email,
            name: name,
        });
    }

    public createPaymentIntent(amount: number, customerId: string) {
        return new Promise<PaymentIntentResponse>((resolve, reject) => {
            this.stripe.paymentIntents.create({
                amount: amount,
                currency: 'aud',
                customer: customerId,
                automatic_payment_methods: {
                    enabled: true,
                }
            })
                .then(ret => {

                    resolve({
                        clientSecret: ret.client_secret ? ret.client_secret : '',
                        id: ret.id,
                        amount: ret.amount,
                        currency: ret.currency,
                        // customer: ret.customer,
                    });

                })
                .catch(err => {
                    reject(err);
                });
        })
    }

    public createPaymentMethod = (card: string) => {

        return this.stripe.paymentMethods.create({
            type: 'card',
            card: {
                token: card,
            },
        });
    }

}
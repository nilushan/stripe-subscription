import {Stripe} from  'stripe'

import { Configs } from './config';

export class StripeAPI {

    private stripe : Stripe;
    constructor(){
        this.stripe = new Stripe( Configs.stripeApiKey, {apiVersion: '2022-11-15'} );
    }

    public listProducts = () => {
        return this.stripe.products.list();
    }

    public listPricesOfProduct = (productId: string) => {

        return this.stripe.prices.list({    
            product: productId,
            active: true,
            limit: 10,
        });
    }

    public createSubscription = (customerId: string, priceId: string) => {
        return this.stripe.subscriptions.create({
            customer: customerId,
            items: [{price: priceId}],
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

    public createPaymentMethod = (card: string) => {

        return this.stripe.paymentMethods.create({
            type: 'card',
            card: {
                token: card,
            },
        });
    }

}
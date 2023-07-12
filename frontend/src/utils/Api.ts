
import { Customer, PaymentIntentResponse, Price, ProductsAndPrices, Subscription } from '../../../shared/types'
import { configs } from './config';

export class BackendApi {

    private backendUrl = configs.backendUrl;  // TODO define a config file for this

    public getProductsAndPrices = () => {
        return new Promise<ProductsAndPrices>((resolve, reject) => {
            fetch(this.backendUrl + '/stripe/products_prices')
                .then(async response => {
                    const res = await response.json();
                    if (response.status === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                }).catch(err => {
                    reject(err);
                })


        });
    }

    // get price by id
    public getPrice = (priceId: string) => {
        return new Promise<Price>((resolve, reject) => {
            fetch(this.backendUrl + '/stripe/prices/' + priceId)
                .then(async response => {
                    const res = await response.json();
                    if (response.status === 200) {
                        resolve(res);
                    }
                    else{
                        reject(res);
                    }
                })
                .catch(err => {
                    reject(err);
                })

        })
    }


    // create payment intent 
    public createPaymentIntent = (amount: number, currency: string) => {
        return new Promise<PaymentIntentResponse>((resolve, reject) => {
            fetch(this.backendUrl + '/stripe/payment_intents',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: amount,
                        currency: currency
                    })
                })
                .then(async response => {
                    const res = await response.json();
                    if (response.status === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        });
    }

    //create subscription
    public createSubscription = (customerId: string, priceId: string) => {
        return new Promise<Subscription>((resolve, reject) => {
            fetch(this.backendUrl + '/stripe/subscriptions',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customerId: customerId,
                        priceId: priceId
                    })
                })
                .then(async response => {
                    const res = await response.json();
                    if (response.status === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }

    // get customer by email
    public getCustomerByEmail = (email: string) => {

        return new Promise<Customer>((resolve, reject) => {
            fetch(this.backendUrl + '/stripe/customers?email=' + email)
                .then(async response => {
                    const res = await response.json();
                    if (response.status === 200) {
                        resolve(res);
                    } else {
                        reject(res);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}
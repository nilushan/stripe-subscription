
import { PaymentIntentResponse, Price, ProductsAndPrices } from '../../../shared/types'

export class BackendApi {

    private backendUrl = "http://localhost:3001";  // TODO define a config file for this

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
                    if (response.status === 200) {
                        const res = await response.json();
                        resolve(res);
                    } else {
                        reject('not a 200 response');
                    }
                })
                .catch(err => {
                    reject(err);
                })
        });
    }
}
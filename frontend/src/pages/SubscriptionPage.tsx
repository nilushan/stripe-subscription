import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CardElement, useStripe, useElements, AddressElement, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import { configs } from '../utils/config'
import { Link, useParams } from 'react-router-dom';
import { BackendApi } from '../utils/Api';

// const api = new BackendApi();

const stripeSecret = configs.stripe.secret;
const stripePromise = loadStripe(stripeSecret);

const SubscriptionComponent = () => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState('basic');
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setLoading(false);
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: customer.name,
        email: customer.email,
      },
    });

    if (error) {
      console.error(error);
      setLoading(false);
    } else {
      // Send paymentMethod.id and product to your server to create a subscription
      console.log(paymentMethod.id, product);
      setLoading(false);
    }
  };

  return (


    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px', width: '100%', padding: '20px', borderRadius: '4px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', backgroundColor: '#fff' }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Subscribe to Zimi </h2>
        
          <label>
            Billing address:
            <AddressElement options={{ mode: 'billing' }} />
          </label>

        <label style={{ display: 'block', marginBottom: '10px' }}>
          Payment details:
          <PaymentElement />
        </label>
        <button type="submit" disabled={!stripe || loading} style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}>
          {loading ? 'Loading...' : 'Subscribe'}
        </button>
      </form>
    </div>

  );

};

export interface ISubscriptionPageProps {
}

const SubscriptionPage = (props: ISubscriptionPageProps) => {

  // const stripeSecret = configs.stripe.secret;
  // const [stripePromise] = useState( loadStripe(stripeSecret));

  const api = useMemo(() => new BackendApi(), []);
  const initialized = useRef(false);  // to prevent useEffect from running on second render

  const { networkid, priceid } = useParams();
  const [clientSecret, setclientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);


  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      console.log('SubscriptionPage', priceid)
      if (priceid !== undefined) {
        setIsLoading(true);

        api.getPrice(priceid)
          .then(priceRet => {
            // console.log(priceRet)

            api.createPaymentIntent(priceRet.unit_amount, priceRet.currency)
              .then((res) => {
                console.log(res)
                setclientSecret(res.clientSecret);
                setIsLoading(false)
              })
              .catch((err) => {
                setErrorMsg(JSON.stringify(err));
                setIsLoading(false)
              })

          })
          .catch(err => {
            console.log(err);
            setErrorMsg(JSON.stringify(err));
            setIsLoading(false)
          })
      }
    }
  }, [priceid, api]);

  // useEffect(() => {
  //   console.log('api useEffect', api)

  // }, [api]);

  const appearance: Appearance = {
    theme: 'stripe'
  };

  return (
    <div>
      {isLoading && <div> Loading ... </div>}

      {clientSecret && <Elements stripe={stripePromise} options={
        {
          appearance: appearance,
          clientSecret: clientSecret
        }
      } >
        <SubscriptionComponent />
      </Elements>
      }
      <div>
        {errorMsg && <div> Error message :  {errorMsg} </div>}
      </div>

      <div>
        Products Page : <Link to="/products"> Products </Link>
      </div>
    </div>
  )
}

export default SubscriptionPage;
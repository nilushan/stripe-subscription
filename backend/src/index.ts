import express, { response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { StripeAPI } from './Stripe'


const app = express();
const port = 3001;

const stripe = new StripeAPI();

app.use(bodyParser.json());
app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// log all requests
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.path}`);
//   next();
// });

// log all responses



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/stripe/products', (req, res) => {
  stripe.listProducts().then((products) => {
    res.send(products);
  })
    .catch((err) => {
      res.status(500).send(err);
    })
});

app.get('/stripe/products/:productId/prices', (req, res) => {
  const productId = req.params.productId as string;
  stripe.listPricesOfProduct(productId)
    .then((prices) => {
      res.send(prices);
    })
    .catch((err) => {
      res.status(500).send(err);
    })

});

// create customer

app.post('/stripe/customers', (req, res) => {
  const { email, name } = req.body;
  stripe.createCustomer(email, name)
    .then((customer) => {
      res.send(customer);
    })
    .catch((err) => {
      res.status(500).send(err);
    });

});

// create subscription
app.post('/stripe/subscriptions', (req, res) => {
  const { customerId, priceId } = req.body;
  stripe.createSubscription(customerId, priceId)

    .then((subscription) => {
      res.send(subscription);
    })
    .catch((err) => {
      res.status(500).send(err)
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


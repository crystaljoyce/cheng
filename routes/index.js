require('dotenv').config();

const express = require('express');
const apiRouter = express.Router();
const server = express();
const jwt = require('jsonwebtoken');
const {getUserById} = require('../db');

const {JWT_SECRET = 'nevertell',
  STRIPE_SECRET
} = process.env;

const stripe = require('stripe')(STRIPE_SECRET);

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const {id} = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }

    } catch (error) {
      next(error);
    }
  } else {
    next({message: `Authorization token must start with ${prefix}`})
  }
})

apiRouter.use((req,res,next) => {
  if (req.user) {
    console.log("User is set: ", req.user);
  }

  next();
});

apiRouter.post('/create-checkout-session', async (req, res, next) => {
  const {order_products, origin} = req.body;
  const order_line_items = order_products.map(product => {
    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price*100,
      },
      quantity: product.quantity,
    }
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: order_line_items,
    mode:'payment',
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout/cancel`,

  });

  res.json({ id: session.id });
});

const productsRouter = require('./products');
apiRouter.use('/products', productsRouter);

const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

const ordersRouter = require('./orders');
apiRouter.use('/orders', ordersRouter);

const orderProductsRouter = require('./order_products');
apiRouter.use('/order_products', orderProductsRouter);

const reviewsRouter = require('./reviews');
apiRouter.use('/reviews', reviewsRouter);

server.use((req, res, next) => {
  res.status(404).send({message: 'Not Found'});
});

server.use((error, req, res, next) => {
  if (res.StatusCode < 400) {
    res.status(500);
  }
  res.send(error);
});

module.exports = apiRouter;

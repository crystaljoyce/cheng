const express = require('express');
const ordersRouter = express.Router();

const {
  getAllOrders,
  getOrderById,
  updateOrder,
  completeOrder,
  cancelOrder,
  createOrder,
  getCartByUser,
  addProductToOrder
} = require('../db');
const {requireUser, requireAdmin} = require('./utils');

const {STRIPE_SECRET} = process.env;

const stripe = require('stripe')(STRIPE_SECRET);

//might need to fix completeOrder

ordersRouter.get('/', requireAdmin, async (req,res,next) => {
  try {
    if (req.user.isAdmin) {
      const orders = await getAllOrders();
      res.send(orders);
    } else {
      res.status(401).send({message: 'Access denied!'});

    }

  } catch (err) {
    next(err);
  }
});

ordersRouter.patch('/:orderId', requireUser, async (req, res, next) => {
  const {status, userId} = req.body;
  const {orderId} = req.params;

  const updateFields = {};

  if (status) {
    updateFields.status = status;
  }

  if (userId) {
    updateFields.userId = userId;
  }

  try {
    const originalOrder = await getOrderById(Number(orderId));

    if (originalOrder.id === Number(orderId)) {
      const updatedOrder = await updateOrder({id: Number(orderId), ...updateFields});

      res.send(updatedOrder)
    } else {
      const completedOrder = await completeOrder(Number(orderId))

      res.send(completedOrder)
    }
  } catch (error) {
    next(error);
  }
});

ordersRouter.post('/', requireUser, async (req,res,next) => {
  try {
    const order = await createOrder({status:'created',userId:req.user.id});
    res.send(order);
  } catch (err) {
    next(err);
  }
})

ordersRouter.get('/cart', requireUser, async (req,res,next) => {
  try {
    const cart = await getCartByUser(req.user.id);
    res.send(cart);
  } catch (err) {
    next(err);
  }
})

ordersRouter.post('/success', requireUser, async (req,res,next) => {
  try {
    const session_id = req.body.session_id;
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const cart = await getCartByUser(req.user.id);

    res.send({session, cartId: cart.id});
  } catch (err) {
    next(err);
  }
})

ordersRouter.delete('/:orderId', requireUser, async (req, res, next) => {
  const {id} = req.params;

  try {
    const order = await cancelOrder(id);

    res.send(order);
  } catch (error) {
    next(error);
  }
})

ordersRouter.post('/:orderId/products', async (req, res, next) => {
  const {productId, price, quantity} = req.body;
  const {orderId} = req.params;
  const productData = {};

  try {
    productData.productId = productId;
    productData.orderId = orderId;
    productData.price = price;
    productData.quantity = quantity;

    const product = await addProductToOrder(productData);

    if (product) {
      res.send(product);
    } else {
      res.status(500).send({message: 'Product was not added to the order.'});
    }

  } catch (error) {
    next(error);
  }
})

module.exports = ordersRouter;

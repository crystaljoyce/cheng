const express = require('express');
const orderProductsRouter = express.Router();

const {getOrderById, getOrderProductById, updateOrderProduct, destroyOrderProduct, getAllOrderProducts} = require('../db');
const {requireUser} = require('./utils');

orderProductsRouter.patch('/:orderProductId', requireUser, async (req, res, next) => {
    const {price, quantity} = req.body;
    const {orderProductId} = req.params;
    const updateFields = {};

    if (price) {
        updateFields.price = price;
    }

    if (quantity) {
        updateFields.quantity = quantity;
    }

    try {
        const product = await getOrderProductById(Number(orderProductId));
        const order = await getOrderById(product.orderId);

        if (order.userId === req.user.id) {
            const orderProduct = await updateOrderProduct({id: orderProductId, ...updateFields});
            
            res.send(orderProduct);
        } else {
            res.status(401).send({message: 'You are not authorized to access this route.'});
        }
    } catch (error) {
        next(error);
    }
})

orderProductsRouter.get('/:orderId', async (req,res,next) => {
  // take orderId parameter, get all order_products for order (getAllOrderProducts)

  try {
    const {orderId} = req.params;
    const order_products = await getAllOrderProducts(orderId);
    res.send(order_products);
  } catch (error) {
    next(error);
  }
})

orderProductsRouter.delete('/:orderProductId', async (req, res, next) => {
    const {orderProductId} = req.params;

    try {
        const product = await getOrderProductById(Number(orderProductId));
        const order = await getOrderById(product.orderId);

        if (order && order.userId === req.user.id) {
            const orderProduct = await destroyOrderProduct(orderProductId);

            res.send(orderProduct);
        } else {
            res.status(401).send({message: 'You are not authorized to access this route.'});
        }
    } catch (error) {
        next(error);
    }
})

module.exports = orderProductsRouter;

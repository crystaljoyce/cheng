const express = require('express');
const productsRouter = express.Router();

const {createProduct, getProductById, getAllProducts, destroyProduct, updateProduct, getOrdersByProduct} = require('../db');
const {requireAdmin} = require('./utils');

productsRouter.get('/', async (req, res, next) => {
    try {
        const products = await getAllProducts();

        res.send(products);
    } catch (error) {
        next(error)
    }
})

productsRouter.get('/:productId', async (req, res, next) => {
    try {
        const product = await getProductById(req.params.productId);

        res.send(product);
    } catch (error) {
        next(error);
    }
})

productsRouter.post('/', requireAdmin, async (req, res, next) => {
    const {name, description, price, imageURL, inStock, category} = req.body;
    const productData = {};

    try {
        productData.name = name;
        productData.description = description;
        productData.price = price;
        productData.imageURL = imageURL;
        productData.inStock = inStock;
        productData.category = category;

        const product = await createProduct(productData);

        if (product) {
            res.send(product)
        } else {
            res.status(500).send({message: 'Product was not created.'});
        }

    } catch (error) {
        next(error);
    }
})

productsRouter.delete('/:productId', requireAdmin, async (req, res, next) => {
    const {productId} = req.params;

    try {
        const product = await destroyProduct(productId);

        res.send(product);
    } catch (error) {
        next(error);
    }
})

productsRouter.patch('/:productId', requireAdmin, async (req, res, next) => {
    const {name, description, price, imageURL, inStock, category} = req.body;
    const {productId} = req.params;

    const updateFields = {};

    if (name) {
        updateFields.name = name;
    }

    if (description) {
        updateFields.description = description;
    }

    if (price) {
        updateFields.price = price;
    }

    if (imageURL) {
        updateFields.imageURL = imageURL;
    }

    if (inStock === true || inStock === false) {
        updateFields.inStock = inStock;
    }

    if (category) {
        updateFields.category = category;
    }

    try {
        const originalProduct = await getProductById(Number(productId));

        if (Number(originalProduct.id) === Number(productId)) {
            const updatedProduct = await updateProduct({id: Number(productId), ...updateFields});
            res.send(updatedProduct);
        }

    } catch (error) {
        next(error);
    }
})

productsRouter.get('/:productId/orders', requireAdmin, async (req, res, next) => {
    const {orderId} = req.params;

    try {
        const products = await getOrdersByProduct(orderId);

        res.send(products);
    } catch (error) {
        next(error);
    }
})

module.exports = productsRouter;

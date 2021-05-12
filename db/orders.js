const {client} = require('./client');

const createOrder = async ({ status, userId, datePlaced }) => {
  try {
    const _datePlaced = datePlaced || new Date().toJSON();
    const { rows: [orderId] } = await client.query(`
      INSERT INTO orders (status, "userId", "datePlaced")
      VALUES ($1, $2, $3)
      RETURNING id;
    `, [status, userId, _datePlaced]);

    const order = await getOrderById(orderId.id);

    return order;
  } catch (error) {
    throw error;
  }
}

const getAllOrders = async () => {
  try {
    const { rows: orderIds } = await client.query(`
      SELECT id FROM orders;
    `);

    const orders = await Promise.all(orderIds.map(
      orderId => getOrderById(orderId.id)
    ));

    return orders;
  } catch (error) {
    throw error;
  }
}

const getOrderById = async (id) => {
  try {
    const { rows: [order]} = await client.query(`
      SELECT *
      FROM orders
      WHERE id = $1;
    `, [id]);

    const { rows: products } = await client.query(`
      SELECT
        p.id, p.name, p."imageURL", p."inStock",
        op.price, op.quantity
      FROM products p JOIN order_products op
      ON p.id=op."productId"
      WHERE op."orderId"=$1;
    `,[id]);

    order.products = products;

    return order;
  } catch (error) {
    throw error;
  }
}

const getOrdersByUser = async (id) => {
  try {
    const { rows: orderIds } = await client.query(`
      SELECT id FROM orders
      WHERE "userId"=$1;
    `, [id]);

    const orders = await Promise.all(orderIds.map(
      orderId => getOrderById(orderId.id)
    ));

    return orders;
  } catch (error) {
    throw error;
  }
}

const getOrdersByProduct = async (id) => {
  try {
    const { rows: orderIds } = await client.query(`
      SELECT o.id FROM orders o
      JOIN order_products op ON o.id=op."orderId"
      WHERE op."productId"=$1;
    `,[id]);

    const orders = await Promise.all(orderIds.map(
      orderId => getOrderById(orderId.id)
    ));

    return orders;
  } catch (err) {
    throw (err);
  }
}

const getCartByUser = async (id) => {
  try {
    const { rows: [orderId] } = await client.query(`
      SELECT id FROM orders
      WHERE "userId"=$1 AND status='created';
    `,[id]);

    const order = await (orderId ? getOrderById(orderId.id) : createOrder({status: 'created', userId:id}));
    
    return order;
  } catch (err) {
    throw (err);
  }
}

const updateOrder = async ({ id, status, userId }) => {

  try {
    const {rows: [order] } = await client.query(`
      UPDATE orders
      SET status = $2, "userId" = $3
      WHERE id = $1
      RETURNING *;
    `, [id, status, userId]);

    return order;
  } catch (error) {
    throw error;
  }
}

const completeOrder = async ({ id }) => {
  try {
    const { rows: [order] } = await client.query(`
      UPDATE orders
      SET status = 'completed'
      WHERE id = $1
      RETURNING *;
    `, [id]);

    return order;
  } catch (error) {
    throw error;
  }
}

const cancelOrder = async ( id ) => {
  try {
    const { rows: [order] } = await client.query(`
      UPDATE orders
      SET status = 'cancelled'
      WHERE id = $1
      RETURNING *;
    `, [id]);

    return order;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    createOrder,
    updateOrder,
    completeOrder,
    cancelOrder,
    getCartByUser,
    getOrdersByProduct,
}

const {client} = require('./client');

const getOrderProductById = async (id) => {
    try{
        const {rows: [order_products] } = await client.query(`
          SELECT *
          FROM order_products
          WHERE id = $1;
        `, [id]);

        return order_products;
    }catch (error) {
        throw error;
    }
};

const addProductToOrder = async ({ orderId, productId, price, quantity }) => {
    try{
      const { rows: [order_products] } = await client.query(`
        INSERT INTO order_products("orderId", "productId", price, quantity)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `, [orderId, productId, price, quantity]);

      return order_products;
    } catch (error){
      throw error;
    }
};

const getAllOrderProducts = async (orderId) => {
  // SQL to find each order product associated with order
  try {
    const { rows: order_products } = await client.query(`
      SELECT op.* FROM order_products op
      JOIN orders o ON op."orderId" = o.id
      WHERE o.id = $1;
    `, [orderId]);

    return order_products;
  } catch (err) {
    throw err;
  }
}

const updateOrderProduct = async (fields = {}) => {
  const {id} = fields;

  const setString = Object.keys(fields).map((key, index) => {
    return `${key}=$${index + 1}`
  });

    try{
      const { rows: [order_products] } = await client.query(`
        UPDATE order_products
        SET ${setString}
        WHERE id= ${id}
        RETURNING *;
      `, Object.values(fields));

      return order_products;
    }catch (error){
      throw error;
    }
};

const destroyOrderProduct = async (id) => {
    try {
      const {rows: [deletedOrderProduct]} = await client.query(`
        DELETE FROM order_products
        WHERE id= $1
        RETURNING *;
      `, [id]);

      return deletedOrderProduct;
    }catch(error){
      throw error;
    }
};

module.exports = {
    getOrderProductById,
    addProductToOrder,
    updateOrderProduct,
    destroyOrderProduct,
    getAllOrderProducts
}

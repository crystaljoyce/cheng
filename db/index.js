// export
module.exports = {
  // db methods
  ...require('./products'),
  ...require('./users'),
  ...require('./orders'),
  ...require('./order_products'),
  ...require('./client'),
  ...require('./reviews'),

}

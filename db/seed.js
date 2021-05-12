const {client} = require('./client');
const { buildDB } = require('./init_db');

buildDB()
  .catch(console.error)
  .finally(() => client.end());

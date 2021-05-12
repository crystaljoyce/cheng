import axios from 'axios';

export async function getAllProducts () {
  try {
    const rsp = await axios.get('/api/products');
    rsp.data.sort((a, b) => (a.id > b.id) ? 1 : -1);
    return rsp.data;
  } catch (err) {
    throw err;
  }
}

export async function getProductById (id) {
  try {
    const rsp = await axios.get(`/api/products/${id}`);
    return rsp.data;
  } catch (err) {
    throw err;
  }
}


import React, { useState, useEffect } from 'react';

import {
  Switch,
  Link,
  Route,
  useHistory,
  useLocation
} from 'react-router-dom';

import {
  getAllProducts
} from '../api';

import {
  ProductView,
  ProductsView,
  AccountForm,
  Account,
  Cart,
  Home,
  Checkout,
  Reviews,
  Users,
  SingleUser,
  AddUser,
  AllOrders,
  ProductForm,
  EditProduct,
  AddReview,
  Success
} from './';

const App = () => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState('');
  const [order, setOrder] = useState({});
  const [usersList, setUsersList] = useState([]);
  const [singleUser, setSingleUser] = useState({id: null, username: '', isAdmin: false, firstName: '', lastName: '', email: '', address: '', city: '', state: '', zip: null});
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({id: null, name: '', description: '', price: '', image: '', inStock: false, category: ''});
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({id: null, title: '', content: '', stars: 5, userId: null, productId: null});
  const [orders, setOrders] = useState([]);

  const history = useHistory();
  const location = useLocation();

  useEffect( () => {

  setToken(localStorage.getItem('token'));

    if (token) {
      const captureToken = async () => {
        const response = await fetch(`/api/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const meData = await response.json();

        const order = await fetchOrder(token);
        setOrder(order);
        setUser(meData);
      }
      captureToken();

    }
  }, [token]);

  const handleLogout = (event) => {
    event.preventDefault();
    setUser({});
    setOrder({});
    setToken('');
    localStorage.clear();
    history.push('/');
  }

  const fetchOrder = async (token) => {
    try {
      const order_rsp = await fetch(`/api/orders/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const order = await order_rsp.json();
      order.products.sort((a, b) => (a.id > b.id) ? 1 : -1);
      return order;
    } catch (err) {
      console.log(err);
    }
  }

  const createOrder = async (token) => {
    const order_rsp = await fetch(`/api/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    const order = await order_rsp.json();

    return order;
  }

  const getUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      data.sort((a, b) => (a.id > b.id) ? 1 : -1);
      setUsersList(data);

    } catch (error) {
      console.error(error);
    }
  }

  const getProducts = async () => {
    try {
      const _products = await getAllProducts();
      setProducts(_products);
    } catch (err) {
      console.error(err);
    }
  }

  const getOrders = async () => {
      const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
              'Content-Type': 'Application/json',
              'Authorization': `Bearer ${token}`
          }
      });
      const data = await response.json();
      data.sort((a, b) => (a.id > b.id) ? 1 : -1);
      setOrders(data);
  }

  const getReviews = async () => {
    const response = await fetch('/api/reviews', {
      method: 'GET',
      headers: {
        'Content-Type': 'Application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json();
    data.sort((a, b) => (a.id > b.id) ? 1 : -1);
    setReviews(data);
  }

  const states = [
    { 'label':'Alabama', 'value': 'AL' },
    { 'label':'Alaska', 'value': 'AK'},
    { 'label':'American Samoa', 'value': 'AS'},
    { 'label':'Arizona', 'value': 'AZ'},
    { 'label':'Arkansas', 'value': 'AR'},
    { 'label':'California', 'value': 'CA'},
    { 'label':'Colorado', 'value': 'CO'},
    { 'label':'Connecticut', 'value': 'CT'},
    { 'label':'Delaware', 'value': 'DE'},
    { 'label':'District of Columbia', 'value': 'DC'},
    { 'label':'States of Micronesia', 'value': 'FM'},
    { 'label':'Florida', 'value': 'FL'},
    { 'label':'Georgia', 'value': 'GA'},
    { 'label':'Guam', 'value': 'GU'},
    { 'label':'Hawaii', 'value': 'HI'},
    { 'label':'Idaho', 'value': 'ID'},
    { 'label':'Illinois', 'value': 'IL'},
    { 'label':'Indiana', 'value': 'IN'},
    { 'label':'Iowa', 'value': 'IA'},
    { 'label':'Kansas', 'value': 'KS'},
    { 'label':'Kentucky', 'value': 'KY'},
    { 'label':'Louisiana', 'value': 'LA'},
    { 'label':'Maine', 'value': 'ME'},
    { 'label':'Marshall Islands', 'value': 'MH'},
    { 'label':'Maryland', 'value': 'MD'},
    { 'label':'Massachusetts', 'value': 'MA'},
    { 'label':'Michigan', 'value': 'MI'},
    { 'label':'Minnesota', 'value': 'MN'},
    { 'label':'Mississippi', 'value': 'MS'},
    { 'label':'Missouri', 'value': 'MO'},
    { 'label':'Montana', 'value': 'MT'},
    { 'label':'Nebraska', 'value': 'NE'},
    { 'label':'Nevada', 'value': 'NV'},
    { 'label':'New Hampshire', 'value': 'NH'},
    { 'label':'New Jersey', 'value': 'NJ'},
    { 'label':'New Mexico', 'value': 'NM'},
    { 'label':'New York', 'value': 'NY'},
    { 'label':'North Carolina', 'value': 'NC'},
    { 'label':'North Dakota', 'value': 'ND'},
    { 'label':'Northern Mariana Islands', 'value': 'MP'},
    { 'label':'Ohio', 'value': 'OH'},
    { 'label':'Oklahoma', 'value': 'OK'},
    { 'label':'Oregan', 'value': 'OR'},
    { 'label':'Palau', 'value': 'PW'},
    { 'label':'Pennsylvania', 'value': 'PA'},
    { 'label':'Puerto Rico', 'value': 'PR'},
    { 'label':'Rhode Island', 'value': 'RI'},
    { 'label':'South Carolina', 'value': 'SC'},
    { 'label':'South Dakota', 'value': 'SD'},
    { 'label':'Tennessee', 'value': 'TN'},
    { 'label':'Texas', 'value': 'TX'},
    { 'label':'Utah', 'value': 'UT'},
    { 'label':'Vermont', 'value': 'VT'},
    { 'label':'Virgin Islands', 'value': 'VI'},
    { 'label':'Virginia', 'value': 'VA'},
    { 'label':'Washington', 'value': 'WA'},
    { 'label':'West Virginia', 'value': 'WV'},
    { 'label':'Wisconsin', 'value': 'WI'},
    { 'label':'Wyoming', 'value': 'WY'}
    ];

  return (<>
  <div id="logo-head">
  <img className="logo" src={'/images/name.png'}/>
  <div className="nav-bar">
    <nav>
      <Link to="/">Home</Link>
      <Link to="/products">Shop</Link>
      <Link to="/cart" id={token ? '' : 'loggedOut-cart'}>Cart</Link>
      <Link to="/account" id={token ? '' : 'loggedOut-account'}>Account</Link>
      <Link to='/users' id={user.isAdmin ? '' : 'users-is-not-admin'}>Users</Link>
      <Link to='/orders' id={user.isAdmin ? '' : 'orders-is-not-admin'}>Orders</Link>
      <Link to="/" id={token ? '' : 'loggedOut-logout'} onClick={handleLogout}>Logout</Link>
      <Link to="/login" id={!token ? '' : 'loggedOut-login'}>Login</Link>
    </nav>
  </div>
  </div>
      <div className="App">

        <Switch>

          <Route exact path='/'>
            <Home />
          </Route>

          <Route exact path ='/products/add'>
            <ProductForm user={user} token={token} getProducts={getProducts} product={product} setProduct={setProduct} />
          </Route>

          <Route exact path='/products/edit/:productId'>
            <EditProduct user={user} token={token} product={product} setProduct={setProduct} getProducts={getProducts} />
          </Route>

          <Route path="/products/:productId">
            <ProductView user={user} order={order} token={token} product={product} setProduct={setProduct} getProducts={getProducts} reviews={reviews} setReviews={setReviews} fetchOrder={fetchOrder} setOrder={setOrder} />
          </Route>

          <Route exact path="/products">
            <ProductsView order={order} token={token} user={user} products={products} getProducts={getProducts} reviews={reviews} fetchOrder={fetchOrder} setOrder={setOrder}/>
          </Route>

          <Route path ='/login'>
            <AccountForm type={'login'} setToken={setToken} setUser={setUser} states={states} setOrder={setOrder} fetchOrder={fetchOrder} createOrder={createOrder}/>
          </Route>

          <Route path='/register'>
            <AccountForm  type={'register'} setToken={setToken} setUser={setUser} states={states} setOrder={setOrder} fetchOrder={fetchOrder} createOrder={createOrder}/>
          </Route>

          <Route path='/account'>
            <Account user={user} token={token} reviews={reviews} setReviews={setReviews} orders={orders} setOrders={setOrders} setProduct={setProduct} getReviews={getReviews} />
          </Route>

          <Route exact path='/cart'>
            <Cart token={token} user={user} order={order} setOrder={setOrder} fetchOrder={fetchOrder}/>
          </Route>

          <Route exact path='/cart/checkout'>
            <Checkout order={order} user={user} token={token} />
          </Route>

          <Route exact path='/users' >
            <Users user={user} setSingleUser={setSingleUser} getUsers={getUsers} usersList={usersList} />
          </Route>

          <Route exact path='/users/add'>
            <AddUser user={user} getUsers={getUsers} states={states} />
          </Route>

          <Route exact path='/users/:userId'>
            <SingleUser token={token} user={user} singleUser={singleUser} setSingleUser={setSingleUser} getUsers={getUsers} states={states} />
          </Route>

          <Route exact path='/orders'>
            <AllOrders user={user} orders={orders} getOrders={getOrders} />
          </Route>

          <Route path='/reviews/:productId'>
            <AddReview token={token} user={user} product={product} review={review} setReview={setReview} getReviews={getReviews} />
          </Route>

          <Route exact path="/checkout/success">
            <Success token={token} user={user} setOrder={setOrder} createOrder={createOrder}/>
          </Route>

          <Route exact path="/checkout/cancel">
            <div className="cancelled">
            <h1>CANCELLED THE ORDER</h1>
            <p>
              We hope you come back soon! <br/>
              If you have any questions, please e-mail <br/>
              <a href="mailto:orders@example.com">orders@example.com</a>
            </p>
            </div>
          </Route>

        </Switch>

      </div>
    </>
  );
}

export default App;

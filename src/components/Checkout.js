import React from 'react';
import {Link} from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js';

// Load stripe once instead of on every render
const stripePromise = loadStripe('pk_test_51IbHarLk15zqG3FqAIpqPc0vFDQpQRLADB7RKQlvrwRVdHJgx0S4UMy014DDa4O9dmFRKuEMNC7kx0ZhkiMj41CC00QyNGxLnj')

const Checkout = ({ order, user, token }) => {
  const {id, firstName, lastName, email, address, city, state, zip } = user;

    const handleClick = async (event) => {
      // Get Stripe.js instance
      const stripe = await stripePromise;

      // Call backend to create checkout sessions
      const rsp = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({order_products: order.products, origin: window.location.origin})
      });

      const session = await rsp.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    }

    return (<div className='checkout'>


    { token
    ?  <> <div className="checkout"><div> Your order will be sent to the following address: </div>
        <div className="checkout-detail"> <div> {firstName} {lastName}</div>
        <div> {address} </div>
        <div> {city}, {state} {zip}</div>
        <div> {email} </div></div> </div>
        </>

    : <h3> You must be a registered user before you can checkout. Please register <Link to='/register'>here.</Link></h3>

    }
    <br/>

    <button className="btn" role="link" onClick={handleClick} > Complete Order </button>


    </div>)
}

export default Checkout;

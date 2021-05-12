import React, { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

const Success = ({token, user, setOrder, createOrder}) => {
  const location = useLocation();

  useEffect(() => {
    const session_id = new URLSearchParams(location.search).get('session_id');

    if (token) {
      const getSession = async () => {
        const session_rsp = await fetch('/api/orders/success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            session_id: session_id,
          })
        })

        const {session, cartId} = await session_rsp.json();

        if (session && session.payment_status === 'paid') {

          const updatedOrder = await fetch(`/api/orders/${cartId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({userId: user.id, status: 'completed'})
          });
          const newOrder = await createOrder(token);
          setOrder(newOrder);
        }
      }

      getSession();
    }
  }, [user])

  return (
    <div className="success">
      <h1>THANK YOU FOR YOUR ORDER</h1>
      <p>
        We appreciate every customer that believes in our dream. <br/>
        If you have any questions, please e-mail <br/>
        <a href="mailto:orders@example.com">orders@example.com</a>
      </p>
    </div>
  )
}

export default Success;

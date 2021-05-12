import React, {useState} from 'react';
import axios from 'axios';

const CartItem = ({token, product, removeItem, order, fetchOrder, setOrder}) => {
    const [cartQuantity, setCartQuantity] = useState(product.quantity);
    const {id, imageURL, name, quantity, price} = product;

    const updateQuantity = async (newQuantity, id) => {
        try {
            await setCartQuantity(newQuantity);

            const op_rsp = await axios.get(`/api/order_products/${order.id}`);
            const order_products = await op_rsp.data;
            const [order_product] = order_products.filter((order_product) => {
                return order_product.productId === id;
            });

            const response = await axios.patch(`/api/order_products/${order_product.id}`, {
                quantity: newQuantity
            } ,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const {data} = await response;
            const nextOrder = await fetchOrder(token);
            setOrder(nextOrder);

        } catch (error) {
            console.error(error)
        }
    }

    return (<div className='cart-item'>
        <div key={id}>
            <table className="cart-table">
                <tbody>
                <tr>
                <td><button className="btn-cart" onClick={() => removeItem(product.id)}>X</button></td>
                <td><img className="cart-img" src={imageURL}/> </td>
                <td><h4 className="prod-col" > {name}</h4></td>
                <td><h4 >Quantity:
                <input required type='number' min='0' value={quantity} onChange={(event) => updateQuantity(event.target.value, id)}></input>
                </h4></td>
                <td><h4 className="sub-col" > ${price * quantity}.00</h4></td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>)
}

export default CartItem;

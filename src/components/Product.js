import React, { useEffect } from 'react';
import axios from 'axios';
import {
  useParams,
  Link,
  useHistory
} from 'react-router-dom';

import {
  getProductById
} from '../api';

const SmallProduct = ({user, product, reviews, token, order, fetchOrder, setOrder}) => {
  const {id,name,price,imageURL} = product;

  const addToCart = async () => {
    try {
      const response = await axios.post(`/api/orders/${order.id}/products`,{
        productId: id,
        price: price,
        quantity: 1
      },{
        headers: {
          "content-type" : "application/json",
          "Authorization" : `Bearer ${token}`
        }
      })
      const {data} = await response;
      const nextOrder = await fetchOrder(token);
      setOrder(nextOrder);
    } catch (error) {
      console.error(error)
    }
  }

  const shopReviews = reviews.filter((review) => {
    if(product.id === review.productId){
      return review
    }
  })

  const stars = shopReviews.map((review) => {
    return review.stars
  })

  const avgStars = stars.reduce((a,b) => a + b, 0) / stars.length

  return (
    <div className="shop-container">
    <div className="small-prod-container">
    <div className="small-product">
    <Link to={`/products/${id}`}><img src={imageURL ? imageURL : "/images/no-image.png"} alt={name}/> </Link> </div>
    <h1 className="prod-info">{name}<br/> ${price}</h1>
    <h2 className="rev-image">{avgStars > 4
    ? <img className="rev-image" src={'/images/5_stars.png'}/>
    : <img className="rev-image" src={'/images/4_stars.png'}/>}</h2>

    {user.id ? <button className="btn" onClick={addToCart}> add to cart </button> : ''}
    </div>
    </div>
  )
}

const Product = ({user, product, order, token, fetchOrder, setOrder}) => {
  const {id,name,price,inStock,category,description,imageURL} = product;

  const addToCart = async () => {
    try {
      const response = await axios.post(`/api/orders/${order.id}/products`,{
        productId: id,
        price: price,
        quantity: 1
      },{
        headers: {
          "content-type" : "application/json",
          "Authorization" : `Bearer ${token}`
        }
      })
      const {data} = await response;
      const nextOrder = await fetchOrder(token);
      setOrder(nextOrder);
    } catch (error) {
      console.error(error)
    }
  }

    return (<div className="prod-container">
      <div className="product">
        <img className='product-img' src={imageURL ? imageURL : "/images/no-image.png"} alt={name}/>

        <div className="prod-details">
          <h1>{name}</h1>
          <h2>${price} - {inStock ? "In Stock!" : "Out of Stock!"}</h2>
          <h3>{category}</h3>
          <p>{description}</p>
        </div>

          {user.id ? <button className="btn" onClick={addToCart}> Add To Cart</button> : ''}
      </div>
    </div>
  )
}

const ProductsView = ({order, token, user, products, getProducts, reviews, fetchOrder, setOrder}) => {

  useEffect(() => {
    getProducts();
  },[]);

  return (<>
    <div id='shop-head'> <h2>Personalized Fashion</h2> <br/>
    {user.isAdmin ? <Link to='/products/add'><button className="btn">Add A New Product</button></Link> : ''}
    </div>

    <div className="products">
      {products.map(product => (
          <SmallProduct user={user} key={product.id} product={product} reviews={reviews} token={token} order={order} fetchOrder={fetchOrder} setOrder={setOrder}/>
      ))}
    </div>
    </>
  )
}

const ProductView = ({user, order, token, product, setProduct, getProducts, reviews, setReviews, fetchOrder, setOrder}) => {
  const {productId} = useParams();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const _product = await getProductById(productId);

        setProduct(_product);
      } catch (err) {
        console.error(err);
      }
    }

    getProduct();
  }, [productId]);

  let history = useHistory();
  const goToPreviousPath = () => {
    history.push('/products') }

  const handleDelete = async (id) => {
    if (user.isAdmin) {
      try {
        const response = await axios.delete(`/api/products/${id}`, {
          headers: {
            'Content-Type': 'Application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const {data} = await response;
        setProduct(data);
        getProducts();
        history.push('/products');
      } catch (error) {
        console.error(error);
      }
    }
  }

  const prodReviews = reviews.filter( review => {
    if (product.id === review.productId) {
      return review;
    }
  })

  return (<>
    <button className={'btn'} onClick={goToPreviousPath} >  Return To Shop</button>
    {user.isAdmin ? <Link to={`/products/edit/${product.id}`}><button className="btn-product" >Edit Product</button></Link> : ''}
    {user.isAdmin ? <button className="btn-product" onClick={() => handleDelete(product.id)} >Delete Product</button> : ''}
    
    <Product user={user} product={product} reviews={reviews} setReviews={setReviews} order={order} token={token} key={product.id} fetchOrder={fetchOrder} setOrder={setOrder} />
    
    <div className="prod-reviews">
    <h2> See what our customers have to say about {product.name}</h2> <br/>

      {prodReviews.map( (review,idx) => {
        const {title, content, stars} = review;
        return <div key={idx}>
        <h3 className="small-prod-star"> {stars > 4 ? <img src={'/images/5_stars.png'}/> : <img src={'/images/4_stars.png'}/>}</h3>
        <h3>{title}</h3>
        <div > {content} </div> <br/>
        </div>
      })}
    </div>
    </>
  )
}

export {SmallProduct,Product,ProductsView,ProductView};

import React from 'react';
import {useHistory} from 'react-router-dom';

const AddReview = ({token, user, product, review, setReview, getReviews}) => { 
    const {title, content, stars} = review;
    const starRatings = [5, 4, 3, 2, 1];
    const {name} = product;

    const history = useHistory();

    const handleSubmit = async (event) => {
        try {
            event.preventDefault();

            const response = await fetch(`/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'Application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title, 
                    content,
                    stars,
                    userId: user.id,
                    productId: product.id
                })
            })
            const data = await response.json();
            setReview(data);
            getReviews();
            history.push('/account');
            setReview({id: null, title: '', content: '', stars: 5, userId: null, productId: null});
        } catch (error) {
            console.error(error);
        }
    }

    const handleOnChange = async (event) => {
        setReview({...review, [event.target.name]: event.target.value});
    }

    return (<div className='add-review'>
        <h3>Reviewing {name}</h3>
        <form onSubmit={handleSubmit}>
            <div>
                <div>Title</div>
                <input required type='text' name='title' value={title} onChange={handleOnChange}></input>
            </div>
            <div>
                <div>Content</div>
                <textarea required type='text' name='content' value={content} onChange={handleOnChange}></textarea>
            </div>
            <div>
                <div>Star Rating</div>
                <select required name='stars' value={stars} onChange={handleOnChange}>
                    {starRatings.map((star, index) => {
                        return <option key={index + 1}>{star}</option>
                    })}
                </select>
            </div>
            <button type='submit' className='btn'>Submit Review</button>
        </form>
    </div>)
}

export default AddReview;
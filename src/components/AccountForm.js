import React, {useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import Dropdown from 'react-dropdown';

const AccountForm = ({type, setToken, setUser, states, setOrder, fetchOrder, createOrder}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [loginMessage, setLoginMessage] = useState('');

    const history = useHistory();
    const title = type === 'login' ? 'LOGIN' : 'REGISTER';
    const oppositeTitle = type === 'login' ? 'Not yet registered? Sign up here!' : 'Already registered? Login here!'
    const oppositeType = type === 'login' ? 'register' : 'login';

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (type === 'register' && password !== confirmPassword) {
            setLoginMessage('Passwords do not match. Please try again.')
        } else {
            const response = await fetch(`/api/users/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password,
                    firstName,
                    lastName,
                    email,
                    address,
                    city,
                    state,
                    zip
                })
            })
            const data = await response.json();
            setLoginMessage(data.message);

            const token = data.token ? data.token : '';
            localStorage.setItem('token', token);
            if (token) {
                setToken(token);

                const response = await fetch(`/api/users/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                const meData = await response.json();

                const order = await (type === 'register' ? createOrder(token) : fetchOrder(token));

                setOrder(order);
                setUser(meData);
                setUsername('');
                setPassword('');
                setConfirmPassword('');
                history.push('/');
            }
        }

    }

    const handleSelectState = (event) => {
        setState(event.value)
    }

    const options = states.map((state) => {
        return {
            value: state.value,
            label: state.label
        }
    })

    return (
        <div className='login-form'>
        <div className='image-container'>
    <div className='login-row'>
    <div className="login-image img3"></div>
    <div className='login-text-container'>

    <div className='our-text'>
    </div>

        <div className='our-title'>{loginMessage}</div>
        <br />
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
            <div>
                <div>Username</div>
                <input type='text' value={username} minLength='3' maxLength='20' required onChange={event => setUsername(event.target.value)}></input>
            </div>
            <div>
                <div>Password</div>
                <input type='password' value={password} minLength='7' maxLength='20' required onChange={event => setPassword(event.target.value)}></input>
            </div>
            <div>
                {type === 'register' ?
                    <>
                        <div>
                            <div>Confirm Password</div>
                            <input type='password' value={confirmPassword} minLength='7' maxLength='20' required onChange={event => setConfirmPassword(event.target.value)}></input>
                        </div>
                        <div>
                            <div>First Name</div>
                            <input type='text' value={firstName} required onChange={event => setFirstName(event.target.value)} ></input>
                        </div>
                        <div>
                            <div>Last Name</div>
                            <input type='text' value={lastName} required onChange={event => setLastName(event.target.value)} ></input>
                        </div>
                        <div>
                            <div>Email</div>
                            <input type='email' value={email} required onChange={event => setEmail(event.target.value)} ></input>
                        </div>
                        <div>
                            <div>Address</div>
                            <input type='text' value={address} required onChange={event => setAddress(event.target.value)} ></input>
                        </div>
                        <div>
                            <div>City</div>
                            <input type='text' value={city} required onChange={event => setCity(event.target.value)} ></input>
                        </div>
                        <div>
                            <div>State</div>
                            <Dropdown
                                className="state-drop"
                                options={options}
                                selected={options}
                                onChange={handleSelectState}
                                placeholder={"select your state"}/>
                        </div>
                        <div>
                            <div>Zip Code</div>
                            <input type='number' value={zip} required minLength='5' maxLength='5' onChange={event => setZip(event.target.value)} ></input>
                        </div>
                    </>
                : ''}
            </div>
            <button type='submit' className='btn'>{title}</button>
        </form>
        <div id='opposite-account-form'><Link to={`/${oppositeType}`}>{oppositeTitle}</Link></div>
    </div>
    </div>
    </div>
    </div>)
}

export default AccountForm;

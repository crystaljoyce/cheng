import React, {useEffect} from 'react';
import {Redirect, Link} from 'react-router-dom';

//set a message for the username update if the username you are trying to change already exists

const Users = ({user, setSingleUser, getUsers, usersList}) => {

    useEffect( () => {
        getUsers();
    }, []);

    if (user.isAdmin) {
        return (<>
         
            <div className='users-list'>

                {usersList.map(_user => {
                    const {id, username, isAdmin} = _user;

                    return (<div className='single-user' key={id}>
                        <div className="single-user-detail"> 
                        <br />
                        <Link to={`/users/${id}`}><h3 onClick={() => setSingleUser(_user)}>{username}</h3></Link>
                        <div>User ID: {id}</div>
                        <div>isAdmin? {isAdmin ? 'Yes' : 'No'}</div>
                        </div>
                    </div>)
                })}
            </div>
           
            <Link to='/users/add'><button className="btn">Add A New User</button></Link>
            
        </>)
    } else {
        return <Redirect to='/' />
    }
}

export default Users;
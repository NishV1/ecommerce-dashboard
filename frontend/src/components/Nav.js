import React from 'react';
import { Link } from 'react-router-dom';
const Nav = () => {
    const user = localStorage.getItem("user-info"); // Retrieve user info from local storage
    return (
        <div>
            <ul className='nav-ul'>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/add">Add Products</Link></li>
                <li><Link to="/update">Update Products</Link></li>
                <li><Link to ="/profile">Profile</Link></li>
                <li>{user?<Link to="/signout">Sign out</Link>:<Link to="/signup">Sign up</Link>}</li> {/*Conditional rendering based on user sign-in status*/}
            </ul>
        </div>
    )
}
export default Nav;
import React from 'react';
import { Link } from 'react-router-dom';
const Nav = () => {
    return (
        <div>
            <ul className='nav-ul'>
                <li><Link to="/products">Products</Link></li>
                <li><Link to="/add">Add Products</Link></li>
                <li><Link to="/update">Update Products</Link></li>
                <li><Link to="/signout">Sign out</Link></li>
                <li><Link to ="/profile">Profile</Link></li>
            </ul>
        </div>
    )
}
export default Nav;
import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
    const user = localStorage.getItem("user-info");
    const userData = user ? JSON.parse(user) : null;

    return (
        <div>
            <nav className='nav-ul'>
                <div className="nav-left">
                    <Link to="/products" className="logo">E-Dashboard</Link>
                </div>
                <div className="nav-right">
                    {userData ? (
                        <>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/add">Add Product</Link></li>
                            <li><Link to="/profile">Profile ({userData.username})</Link></li>
                            <li><Link to="/signout">Logout</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/products">Products</Link></li>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/signup">Sign Up</Link></li>
                        </>
                    )}
                </div>
            </nav>
        </div>
    )
}

export default Nav;
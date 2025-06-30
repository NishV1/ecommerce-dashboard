import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
    const [userData, setUserData] = useState(null);
    const location = useLocation();

    const updateUserData = () => {
        const user = localStorage.getItem("user-info");
        setUserData(user ? JSON.parse(user) : null);
    };

    useEffect(() => {
        updateUserData();
    }, [location]); // Update when location changes

    useEffect(() => {
        // Update when component mounts
        updateUserData();
        
        // Listen for storage changes (when localStorage is updated)
        const handleStorageChange = () => {
            updateUserData();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        // Custom event for same-tab localStorage changes
        window.addEventListener('userDataChanged', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('userDataChanged', handleStorageChange);
        };
    }, []);

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
                            <li><Link to="/wishlist">My Wishlist</Link></li>
                            <li><Link to="/inquiries">My Inquiries</Link></li>
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
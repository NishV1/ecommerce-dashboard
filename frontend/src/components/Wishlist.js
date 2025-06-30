import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getWishlist();
  }, []);

  const getWishlist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user-info"));
      if (!user?.token) {
        setError("Please login to view your wishlist");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/wishlist", {
        headers: {
          "authorization": `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch wishlist");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user-info"));
      const response = await fetch(`http://localhost:5000/wishlist/remove/${productId}`, {
        method: "DELETE",
        headers: {
          "authorization": `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        // Remove item from local state
        setWishlistItems(wishlistItems.filter(item => item.productId._id !== productId));
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to remove from wishlist");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  if (loading) {
    return <div className="loading">Loading your wishlist...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="wishlist">
      <h2>My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <h3>Your wishlist is empty</h3>
          <p>Browse products and click the heart icon to add items to your wishlist.</p>
          <Link to="/products">
            <button className="browse-btn">Browse Products</button>
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-item">
              <div className="wishlist-image">
                {item.productId.image ? (
                  <img 
                    src={item.productId.image} 
                    alt={item.productId.name}
                    onError={(e) => {e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'}}
                  />
                ) : (
                  <div className="no-image">
                    <span>No Image</span>
                  </div>
                )}
              </div>
              
              <div className="wishlist-content">
                <h3>{item.productId.name}</h3>
                <p className="price">${item.productId.price}</p>
                <p className="brand">{item.productId.brand}</p>
                <p className="seller">Seller: {item.productId.userId.username}</p>
                <p className="views">👁 {item.productId.views} views</p>
                <p className="added-date">
                  Added: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className="wishlist-actions">
                <Link to={`/product/${item.productId._id}`}>
                  <button className="view-product-btn">View Product</button>
                </Link>
                <button 
                  className="remove-btn"
                  onClick={() => removeFromWishlist(item.productId._id)}
                >
                  ❤ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

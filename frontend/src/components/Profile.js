import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getUserProfile();
    getUserProducts();
  }, []);

  const getUserProfile = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user-info"));
      if (!userInfo?.token) {
        setError("Please login to view profile");
        return;
      }

      let result = await fetch("http://localhost:5000/profile", {
        headers: {
          authorization: `Bearer ${userInfo.token}`
        }
      });

      if (result.ok) {
        result = await result.json();
        setUser(result);
      } else {
        setError("Failed to fetch profile");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const getUserProducts = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("user-info"));
      if (!userInfo?.token) return;

      let result = await fetch("http://localhost:5000/my-products", {
        headers: {
          authorization: `Bearer ${userInfo.token}`
        }
      });

      if (result.ok) {
        result = await result.json();
        setProducts(result);
      }
    } catch (error) {
      console.error("Failed to fetch user products");
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile">
      <h1>User Profile</h1>
      
      {user && (
        <div className="profile-info">
          <div className="profile-card">
            <h2>Personal Information</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="profile-stats">
            <h2>Statistics</h2>
            <p><strong>Total Products:</strong> {products.length}</p>
            <p><strong>Account Status:</strong> Active</p>
          </div>
        </div>
      )}

      <div className="user-products">
        <h2>My Products ({products.length})</h2>
        {products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                {product.image && (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {e.target.style.display = 'none'}}
                  />
                )}
                <h3>{product.name}</h3>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Brand:</strong> {product.brand}</p>
                <p><strong>Category:</strong> {product.category}</p>
                {product.description && (
                  <p><strong>Description:</strong> {product.description}</p>
                )}
                <p><strong>Added:</strong> {new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No products added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;

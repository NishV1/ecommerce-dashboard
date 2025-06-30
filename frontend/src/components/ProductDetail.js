import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import ContactSeller from "./ContactSeller";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const viewIncrementedRef = useRef(false);
  const params = useParams();

  useEffect(() => {
    // Reset the view increment flag when product ID changes
    viewIncrementedRef.current = false;
    getProductDetails();
    checkWishlistStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const getProductDetails = async () => {
    try {
      // Get product details without incrementing views
      let result = await fetch(`http://localhost:5000/product/${params.id}`);

      if (result.ok) {
        const productData = await result.json();
        setProduct(productData);
        
        // Only increment view if not already done and user is not owner
        if (!viewIncrementedRef.current) {
          const currentUser = getCurrentUser();
          
          // More robust owner check
          let isOwner = false;
          if (currentUser && productData.userId) {
            const productUserId = typeof productData.userId === 'object' 
              ? productData.userId._id 
              : productData.userId;
            isOwner = currentUser._id === productUserId;
          }
          
          // Only increment view count if user is not the owner (allow anonymous users)
          if (!isOwner) {
            viewIncrementedRef.current = true; // Mark as incremented to prevent double increment
            
            try {
              // Increment view count for non-owners
              const viewResult = await fetch(`http://localhost:5000/product/${params.id}/view`, {
                method: "PUT"
              });
              
              if (viewResult.ok) {
                const updatedProduct = await viewResult.json();
                setProduct(updatedProduct);
              }
              // If view increment fails, we already have the product data set above
            } catch (viewError) {
              console.error("Failed to increment view:", viewError);
              // Don't show error to user, just log it
            }
          }
        }
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const getCurrentUser = () => {
    const user = localStorage.getItem("user-info");
    return user ? JSON.parse(user) : null;
  };

  const currentUser = getCurrentUser();
  
  // More robust owner check for render
  const isOwner = currentUser && product && 
    (currentUser._id === (typeof product.userId === 'object' ? product.userId._id : product.userId));

  const handleContactSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 5000); // Clear message after 5 seconds
  };

  const checkWishlistStatus = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser?.token) return;

    try {
      const response = await fetch(`http://localhost:5000/wishlist/check/${params.id}`, {
        headers: {
          "authorization": `Bearer ${currentUser.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInWishlist(data.inWishlist);
      }
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  };

  const toggleWishlist = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser?.token) {
      setError("Please login to add items to your wishlist");
      return;
    }

    setWishlistLoading(true);

    try {
      if (inWishlist) {
        // Remove from wishlist
        const response = await fetch(`http://localhost:5000/wishlist/remove/${params.id}`, {
          method: "DELETE",
          headers: {
            "authorization": `Bearer ${currentUser.token}`
          }
        });

        if (response.ok) {
          setInWishlist(false);
          setSuccessMessage("Removed from wishlist");
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to remove from wishlist");
        }
      } else {
        // Add to wishlist
        const response = await fetch("http://localhost:5000/wishlist/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authorization": `Bearer ${currentUser.token}`
          },
          body: JSON.stringify({ productId: params.id })
        });

        if (response.ok) {
          setInWishlist(true);
          setSuccessMessage("Added to wishlist");
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to add to wishlist");
        }
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setWishlistLoading(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="product-detail">
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <div className="product-detail-container">
        <div className="product-image-section">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="product-detail-image"
              onError={(e) => {e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'}}
            />
          ) : (
            <div className="no-image-placeholder">
              <span>No Image Available</span>
            </div>
          )}
        </div>
        
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <span className="product-price">${product.price}</span>
            <span className="product-views">👁 {product.views} views</span>
          </div>
          
          <div className="product-details">
            <div className="detail-row">
              <strong>Brand:</strong> {product.brand}
            </div>
            <div className="detail-row">
              <strong>Category:</strong> {product.category}
            </div>
            <div className="detail-row">
              <strong>Seller:</strong> {product.userId.username}
            </div>
            <div className="detail-row">
              <strong>Listed:</strong> {new Date(product.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}
          
          <div className="product-actions">
            {isOwner ? (
              <div className="owner-actions">
                <Link to={`/update/${product._id}`}>
                  <button className="update-btn-large">Edit Product</button>
                </Link>
                <p className="owner-note">This is your product</p>
              </div>
            ) : (
              <div className="buyer-actions">
                <button 
                  className="contact-btn"
                  onClick={() => setShowContactModal(true)}
                >
                  Contact Seller
                </button>
                <button 
                  className={`wishlist-btn ${inWishlist ? 'in-wishlist' : ''}`}
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? "..." : inWishlist ? "❤ In Wishlist" : "❤ Add to Wishlist"}
                </button>
              </div>
            )}
            
            <Link to="/products">
              <button className="back-btn">← Back to Products</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Seller Modal */}
      {showContactModal && (
        <ContactSeller
          product={product}
          onClose={() => setShowContactModal(false)}
          onSuccess={handleContactSuccess}
        />
      )}
    </div>
  );
};

export default ProductDetail;

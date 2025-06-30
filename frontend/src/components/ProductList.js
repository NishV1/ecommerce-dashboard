import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductFilter from "./ProductFilter";
import Pagination from "./Pagination";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({});
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    handleFilterChange({});
  }, []);

  const getProducts = async (filters = {}) => {
    setLoading(true);
    setError("");
    
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all' && value !== '') {
          queryParams.append(key, value);
        }
      });

      const url = Object.keys(filters).length > 0 || queryParams.toString()
        ? `http://localhost:5000/products/filter?${queryParams.toString()}`
        : "http://localhost:5000/products";

      let result = await fetch(url);
      
      if (result.ok) {
        result = await result.json();
        
        // Handle both old and new API response formats
        if (result.products) {
          // New filtered API response
          setProducts(result.products);
          setPagination(result.pagination || {});
        } else {
          // Old simple API response
          setProducts(result);
          setPagination({});
        }
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      setError("Network error");
      console.error("Fetch products error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    getProducts({ ...filters, page: 1 }); // Reset to page 1 when filters change
  };

  const handlePageChange = (page) => {
    getProducts({ ...activeFilters, page });
  };

  const deleteProduct = async (id) => {
    const user = JSON.parse(localStorage.getItem("user-info"));
    if (!user?.token) {
      setError("Please login to delete products");
      return;
    }

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        let result = await fetch(`http://localhost:5000/delete-product/${id}`, {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${user.token}`
          }
        });

        if (result.ok) {
          handleFilterChange(activeFilters); // Refresh with current filters
        } else {
          const data = await result.json();
          setError(data.error || "Failed to delete product");
        }
      } catch (error) {
        setError("Network error");
      }
    }
  };

  const getCurrentUser = () => {
    const user = localStorage.getItem("user-info");
    return user ? JSON.parse(user) : null;
  };

  const isUserOwner = (product, user) => {
    if (!user || !product.userId) return false;
    
    // Handle different userId formats (string vs ObjectId)
    const productUserId = typeof product.userId === 'object' ? product.userId._id || product.userId.toString() : product.userId;
    const currentUserId = user._id;
    
    return currentUserId === productUserId;
  };

  const currentUser = getCurrentUser();

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-list">
      <h3>Product Listing</h3>
      {error && <div className="error-message">{error}</div>}
      
      {/* Enhanced Filter Component */}
      <ProductFilter 
        onFilterChange={handleFilterChange}
        initialFilters={activeFilters}
      />

      {/* Results Summary */}
      {pagination.totalProducts !== undefined && (
        <div className="results-summary">
          Showing {products.length} of {pagination.totalProducts} products
          {pagination.totalPages > 1 && (
            <span> (Page {pagination.currentPage} of {pagination.totalPages})</span>
          )}
        </div>
      )}

      {products.length > 0 ? (
        <ul className="products-grid">
          <li className="product-header">
            <h5>S. No</h5>
            <h5>Name</h5>
            <h5>Price</h5>
            <h5>Brand</h5>
            <h5>Category</h5>
            <h5>Views</h5>
            <h5>Operations</h5>
          </li>
          {products.map((item, index) => (
            <li key={item._id} className="product-item">
              <span>{index + 1}</span>
              <span>{item.name}</span>
              <span>${item.price}</span>
              <span>{item.brand}</span>
              <span>{item.category}</span>
              <span className="view-count">👁 {item.views || 0}</span>
              <span className="operations">
                {isUserOwner(item, currentUser) && (
                  <>
                    <button 
                      onClick={() => deleteProduct(item._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                    <Link to={`/update/${item._id}`}>
                      <button className="update-btn">Update</button>
                    </Link>
                  </>
                )}
                <Link to={`/product/${item._id}`}>
                  <button className="view-btn">View</button>
                </Link>
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <h1>No Products found</h1>
      )}

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProductList;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchKey, setSearchKey] = useState("");

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      let result = await fetch("http://localhost:5000/products");
      if (result.ok) {
        result = await result.json();
        setProducts(result);
      } else {
        setError("Failed to fetch products");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
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
          getProducts(); // Refresh the list
        } else {
          const data = await result.json();
          setError(data.error || "Failed to delete product");
        }
      } catch (error) {
        setError("Network error");
      }
    }
  };

  const searchHandle = async () => {
    if (searchKey) {
      try {
        let result = await fetch(`http://localhost:5000/search/${searchKey}`);
        if (result.ok) {
          result = await result.json();
          setProducts(result);
        }
      } catch (error) {
        setError("Search failed");
      }
    } else {
      getProducts();
    }
  };

  const getCurrentUser = () => {
    const user = localStorage.getItem("user-info");
    return user ? JSON.parse(user) : null;
  };

  const currentUser = getCurrentUser();

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-list">
      <h3>Product Listing</h3>
      {error && <div className="error-message">{error}</div>}
      
      <div className="search-container">
        <input
          type="text"
          className="search-box"
          placeholder="Search Products"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button onClick={searchHandle} className="search-btn">
          Search
        </button>
        <button onClick={getProducts} className="search-btn">
          Show All
        </button>
      </div>

      {products.length > 0 ? (
        <ul className="products-grid">
          <li className="product-header">
            <h5>S. No</h5>
            <h5>Name</h5>
            <h5>Price</h5>
            <h5>Brand</h5>
            <h5>Category</h5>
            <h5>Operations</h5>
          </li>
          {products.map((item, index) => (
            <li key={item._id} className="product-item">
              <span>{index + 1}</span>
              <span>{item.name}</span>
              <span>${item.price}</span>
              <span>{item.brand}</span>
              <span>{item.category}</span>
              <span className="operations">
                {currentUser && currentUser._id === item.userId && (
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
    </div>
  );
};

export default ProductList;

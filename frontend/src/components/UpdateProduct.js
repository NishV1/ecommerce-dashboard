import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProductDetails = async () => {
    try {
      let result = await fetch(`http://localhost:5000/product/${params.id}`);
      if (result.ok) {
        result = await result.json();
        setName(result.name);
        setPrice(result.price);
        setBrand(result.brand);
        setCategory(result.category);
        setDescription(result.description || "");
        setImage(result.image || "");
      } else {
        setError("Product not found");
      }
    } catch (error) {
      setError("Failed to fetch product details");
    } finally {
      setFetchLoading(false);
    }
  };

  const updateProduct = async () => {
    if (!name || !price || !brand || !category) {
      setError("Please fill in all required fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user-info"));
    if (!user?.token) {
      setError("Please login to update products");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result = await fetch(`http://localhost:5000/update-product/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          brand,
          category,
          description,
          image
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`
        }
      });

      const data = await result.json();

      if (result.ok) {
        alert("Product updated successfully");
        navigate("/products");
      } else {
        setError(data.error || "Failed to update product");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="loading">Loading product details...</div>;
  }

  return (
    <div className="product-form">
      <h1>Update Product</h1>
      {error && <div className="error-message">{error}</div>}
      
      <input
        type="text"
        placeholder="Enter product name"
        className="inputBox"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      
      <input
        type="number"
        placeholder="Enter product price"
        className="inputBox"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
      />
      
      <input
        type="text"
        placeholder="Enter product brand"
        className="inputBox"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      
      <input
        type="text"
        placeholder="Enter product category"
        className="inputBox"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      
      <textarea
        placeholder="Enter product description"
        className="inputBox description-box"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="4"
      />
      
      <input
        type="url"
        placeholder="Enter image URL"
        className="inputBox"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      
      <button 
        onClick={updateProduct} 
        className="appButton"
        disabled={loading}
      >
        {loading ? "Updating Product..." : "Update Product"}
      </button>
    </div>
  );
};

export default UpdateProduct;

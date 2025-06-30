import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const addProduct = async () => {
    if (!name || !price || !brand || !category) {
      setError("Please fill in all required fields");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user-info"));
    if (!user?.token) {
      setError("Please login to add products");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let result = await fetch("http://localhost:5000/add-product", {
        method: "POST",
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
        alert("Product added successfully");
        navigate("/products");
      } else {
        setError(data.error || "Failed to add product");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h1>Add Product</h1>
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
        onClick={addProduct} 
        className="appButton"
        disabled={loading}
      >
        {loading ? "Adding Product..." : "Add Product"}
      </button>
    </div>
  );
};

export default AddProduct;

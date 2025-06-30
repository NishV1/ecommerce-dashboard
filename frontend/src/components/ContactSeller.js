import React, { useState } from "react";

const ContactSeller = ({ product, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    buyerName: "",
    buyerEmail: "",
    buyerPhone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/contact-seller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          productId: product._id,
          ...formData
        })
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data.message);
        onClose();
        // Reset form
        setFormData({
          buyerName: "",
          buyerEmail: "",
          buyerPhone: "",
          message: ""
        });
      } else {
        setError(data.error || "Failed to send inquiry");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Contact Seller</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="product-info">
            <h3>Inquiring about: {product.name}</h3>
            <p>Seller: {product.userId.username}</p>
            <p>Price: ${product.price}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="buyerName">Your Name *</label>
              <input
                type="text"
                id="buyerName"
                name="buyerName"
                value={formData.buyerName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="buyerEmail">Your Email *</label>
              <input
                type="email"
                id="buyerEmail"
                name="buyerEmail"
                value={formData.buyerEmail}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="buyerPhone">Your Phone (Optional)</label>
              <input
                type="tel"
                id="buyerPhone"
                name="buyerPhone"
                value={formData.buyerPhone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                placeholder="Enter your inquiry about this product..."
                maxLength="1000"
              />
              <small>{formData.message.length}/1000 characters</small>
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="cancel-btn"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Inquiry"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactSeller;

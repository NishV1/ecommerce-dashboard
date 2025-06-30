import React, { useEffect, useState } from "react";

const SellerInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getInquiries();
  }, []);

  const getInquiries = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user-info"));
      if (!user?.token) {
        setError("Please login to view inquiries");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/seller-inquiries", {
        headers: {
          "authorization": `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to fetch inquiries");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (inquiryId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user-info"));
      const response = await fetch(`http://localhost:5000/inquiry/${inquiryId}/read`, {
        method: "PUT",
        headers: {
          "authorization": `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        // Update the inquiry status in the local state
        setInquiries(inquiries.map(inquiry => 
          inquiry._id === inquiryId 
            ? { ...inquiry, status: 'read' }
            : inquiry
        ));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'new': 'status-new',
      'read': 'status-read',
      'replied': 'status-replied'
    };
    return <span className={`status-badge ${statusClasses[status]}`}>{status.toUpperCase()}</span>;
  };

  if (loading) {
    return <div className="loading">Loading inquiries...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="seller-inquiries">
      <h2>Your Product Inquiries</h2>
      
      {inquiries.length === 0 ? (
        <div className="no-inquiries">
          <h3>No inquiries yet</h3>
          <p>When customers contact you about your products, they'll appear here.</p>
        </div>
      ) : (
        <div className="inquiries-list">
          {inquiries.map((inquiry) => (
            <div key={inquiry._id} className={`inquiry-card ${inquiry.status}`}>
              <div className="inquiry-header">
                <div className="product-info">
                  <h3>{inquiry.productId.name}</h3>
                  <span className="product-price">${inquiry.productId.price}</span>
                </div>
                <div className="inquiry-status">
                  {getStatusBadge(inquiry.status)}
                </div>
              </div>
              
              <div className="inquiry-content">
                <div className="buyer-info">
                  <h4>From: {inquiry.buyerName}</h4>
                  <p>Email: <a href={`mailto:${inquiry.buyerEmail}`}>{inquiry.buyerEmail}</a></p>
                  {inquiry.buyerPhone && <p>Phone: <a href={`tel:${inquiry.buyerPhone}`}>{inquiry.buyerPhone}</a></p>}
                </div>
                
                <div className="inquiry-message">
                  <h4>Message:</h4>
                  <p>{inquiry.message}</p>
                </div>
                
                <div className="inquiry-footer">
                  <span className="inquiry-date">
                    {new Date(inquiry.createdAt).toLocaleDateString()} at {new Date(inquiry.createdAt).toLocaleTimeString()}
                  </span>
                  
                  {inquiry.status === 'new' && (
                    <button 
                      className="mark-read-btn"
                      onClick={() => markAsRead(inquiry._id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerInquiries;

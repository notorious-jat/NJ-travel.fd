// src/components/OrderList.js

import React, { useState, useEffect } from 'react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You need to log in first');
        window.location.href = '/login'; // Redirect if no token
        return;
      }

      try {
        const response = await fetch('http://localhost:5001/api/travel/user/package', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.packages||[]);
      } catch (error) {
        setError('Error fetching orders');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []); // Empty dependency array makes it run once after initial render

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-list">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="order-container">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <p>{order.name}</p>
              <h3>Order #{order._id}</h3>
              <p><strong>Date:</strong> {new Date(order.ownedDate).toLocaleDateString()}</p>
              <p><strong>Total:</strong> ${order.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;

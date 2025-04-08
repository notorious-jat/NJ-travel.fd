import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Component for handling quantity with limits
const QuantityHandler = ({ initialQty = 1, onQtyChange }) => {
  const [qty, setQty] = useState(initialQty); // Internal state for quantity
  const minQty = 1; // Minimum quantity limit
  const maxQty = 5; // Maximum quantity limit

  // Update the parent component whenever the quantity changes
  useEffect(() => {
    if (onQtyChange) {
      onQtyChange(qty); // Notify parent about the quantity change
    }
  }, [qty, onQtyChange]);

  // Increase the quantity by 1 (if within limits)
  const increaseQty = () => {
    if (qty < maxQty) {
      setQty(qty + 1);
    } else {
      toast.warn(`Maximum quantity of ${maxQty} reached`);
    }
  };

  // Decrease the quantity by 1 (if within limits)
  const decreaseQty = () => {
    if (qty > minQty) {
      setQty(qty - 1);
    } else {
      toast.warn(`Minimum quantity of ${minQty} reached`);
    }
  };

  return (
    <>
    <div style={styles.container}>
      <button style={styles.button} onClick={decreaseQty}>
        -
      </button>
      <span style={styles.qtyDisplay}>{qty}</span>
      <button style={styles.button} onClick={increaseQty}>
        +
      </button>
    </div>
    </>
  );
};

// Simple styling for the component (you can modify as needed)
const styles = {
  container: {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "#f3f3f3",
    border: "1px solid #000",
    borderRadius: "8px",
    width: "150px",
    height: "50px"
  },
  button: {
    backgroundColor: "#000",
    color: "white",
    border: "none",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    cursor: "pointer",
    width: "40px",
    height: "40px",
    textAlign: "center",
  },
  qtyDisplay: {
    fontSize: "18px",
    fontWeight: "bold",
  },
};

export default QuantityHandler;

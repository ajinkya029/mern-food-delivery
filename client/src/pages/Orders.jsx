import React from "react";
import { useEffect, useState } from "react";
import api from "../api";
import { PackageCheck } from "lucide-react";
const steps = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Out for delivery",
  "Delivered",
];
export default function Orders() {
  const [orders, setOrders] = useState([]),
    [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/orders/my")
      .then((r) => setOrders(r.data))
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load orders."),
      );
  }, []);
  return (
    <div className="wrap orders-page">
      <div className="page-heading">
        <span className="eyebrow">YOUR FOOD JOURNEY</span>
        <h1>My orders</h1>
        <p>All your delicious decisions, in one place.</p>
      </div>
      {error && <div className="form-error">{error}</div>}
      {!orders.length && !error ? (
        <div className="empty-state">
          <PackageCheck size={36} />
          <h3>No orders yet</h3>
          <p>Your next great meal is waiting.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order._id}>
              <div className="order-top">
                <div>
                  <span className="eyebrow">
                    ORDER #{order._id.slice(-7).toUpperCase()}
                  </span>
                  <h3>{new Date(order.createdAt).toLocaleString()}</h3>
                </div>
                <span
                  className={`status status-${order.status.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {order.status}
                </span>
              </div>
              <div className="order-foods">
                {order.items.map((item, i) => (
                  <div key={i}>
                    <img src={item.image} alt="" />
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <b>₹{item.price * item.quantity}</b>
                  </div>
                ))}
              </div>
              <div className="order-bottom">
                <span>Delivering to: {order.deliveryAddress}</span>
                <strong>Total ₹{order.total}</strong>
              </div>
              {order.status !== "Cancelled" && (
                <div className="progress-track">
                  {steps.map((s, i) => (
                    <div
                      className={`progress-step ${steps.indexOf(order.status) >= i ? "done" : ""}`}
                      key={s}
                    >
                      <span></span>
                      <small>{s}</small>
                    </div>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

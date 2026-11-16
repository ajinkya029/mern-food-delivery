import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import api from "../api";
export default function Cart() {
  const { cart, changeQty, clearCart, subtotal, user, notify } = useApp();
  const [address, setAddress] = useState(""),
    [phone, setPhone] = useState(""),
    [payment, setPayment] = useState("cash"),
    [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const fee = cart[0]?.deliveryFee || 0;
  const checkout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/orders", {
        items: cart.map((i) => ({ menuItem: i._id, quantity: i.quantity })),
        deliveryAddress: address,
        phone,
        paymentMethod: payment,
      });
      clearCart();
      notify("Order placed successfully!");
      navigate("/orders", { state: { newOrder: data._id } });
    } catch (err) {
      notify(err.response?.data?.message || "Could not place your order.");
    } finally {
      setBusy(false);
    }
  };
  if (!cart.length)
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">
          <ShoppingBag size={34} />
        </div>
        <h1>Your cart is feeling lonely</h1>
        <p>Good things are cooking. Find something delicious to add.</p>
        <Link className="btn btn-primary" to="/">
          Explore restaurants
        </Link>
      </div>
    );
  return (
    <div className="wrap cart-page">
      <div className="page-heading">
        <span className="eyebrow">ALMOST THERE</span>
        <h1>Your cart</h1>
        <p>From {cart[0].restaurantName}</p>
      </div>
      <div className="checkout-grid">
        <section className="cart-items">
          {cart.map((item) => (
            <article className="cart-item" key={item._id}>
              <img src={item.image} alt={item.name} />
              <div className="cart-item-copy">
                <h3>{item.name}</h3>
                <b>₹{item.price}</b>
                <div className="qty-control">
                  <button
                    onClick={() => changeQty(item._id, -1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => changeQty(item._id, 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <strong className="line-total">
                ₹{item.price * item.quantity}
              </strong>
            </article>
          ))}
          <button className="text-button remove-all" onClick={clearCart}>
            <Trash2 size={14} /> Clear cart
          </button>
          <form className="delivery-form" onSubmit={checkout}>
            <h2>Delivery details</h2>
            <label>
              Delivery address
              <textarea
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House / flat, street, area, landmark..."
                rows="3"
              />
            </label>
            <label>
              Phone number
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                pattern="[0-9+() -]{8,18}"
              />
            </label>
            <label>
              Payment method
              <select
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
              >
                <option value="cash">Cash on delivery</option>
                <option value="online">Online (demo only)</option>
              </select>
            </label>
            <button className="btn btn-primary full" disabled={busy}>
              {busy ? "Placing order..." : `Place order · ₹${subtotal + fee}`}
            </button>
            <small className="muted">
              Online payment is a demo placeholder; no payment is collected.
            </small>
          </form>
        </section>
        <aside className="bill-card">
          <h2>Bill details</h2>
          <div>
            <span>Item total</span>
            <b>₹{subtotal}</b>
          </div>
          <div>
            <span>Delivery fee</span>
            <b>₹{fee}</b>
          </div>
          <div className="bill-total">
            <span>To pay</span>
            <strong>₹{subtotal + fee}</strong>
          </div>
          <p>Inclusive of all applicable taxes.</p>
        </aside>
      </div>
    </div>
  );
}

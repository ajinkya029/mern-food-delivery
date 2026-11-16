import React from "react";
import { Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
export default function MenuItemCard({ item, restaurant }) {
  const { addToCart } = useApp();
  return (
    <article className="menu-card">
      <div className="menu-copy">
        <span className={`veg-dot ${item.isVeg ? "" : "nonveg"}`}></span>
        <h3>{item.name}</h3>
        <strong>₹{item.price}</strong>
        <p>{item.description}</p>
        <button className="add-btn" onClick={() => addToCart(item, restaurant)}>
          <Plus size={15} /> Add
        </button>
      </div>
      <img src={item.image} alt={item.name} />
    </article>
  );
}

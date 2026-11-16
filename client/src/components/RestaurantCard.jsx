import React from "react";
import { Link } from "react-router-dom";
import { Clock3, Star } from "lucide-react";
export default function RestaurantCard({ restaurant }) {
  return (
    <Link to={`/restaurant/${restaurant._id}`} className="restaurant-card">
      <div className="restaurant-image">
        <img src={restaurant.image} alt={restaurant.name} />
        <span className="image-tag">{restaurant.cuisine}</span>
      </div>
      <div className="restaurant-info">
        <div className="restaurant-title">
          <h3>{restaurant.name}</h3>
          <span className="rating">
            <Star size={14} fill="currentColor" />
            {restaurant.rating}
          </span>
        </div>
        <p>{restaurant.description}</p>
        <div className="meta">
          <span>
            <Clock3 size={14} />
            {restaurant.deliveryTime}
          </span>
          <span>Delivery ₹{restaurant.deliveryFee}</span>
        </div>
      </div>
    </Link>
  );
}

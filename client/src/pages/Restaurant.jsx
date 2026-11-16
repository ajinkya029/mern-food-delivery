import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock3, Star } from "lucide-react";
import api from "../api";
import MenuItemCard from "../components/MenuItemCard";
export default function Restaurant() {
  const { id } = useParams();
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    api
      .get(`/restaurants/${id}`)
      .then((r) => setData(r.data))
      .catch((e) =>
        setError(
          e.response?.data?.message || "Could not load this restaurant.",
        ),
      );
  }, [id]);
  if (error)
    return (
      <div className="wrap empty-state error">
        {error}
        <p>
          <Link to="/">Back to restaurants</Link>
        </p>
      </div>
    );
  if (!data) return <div className="wrap empty-state">Loading menu...</div>;
  const groups = [...new Set(data.menu.map((i) => i.category))];
  return (
    <div className="wrap restaurant-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> All restaurants
      </Link>
      <div className="restaurant-hero">
        <img src={data.restaurant.image} alt={data.restaurant.name} />
        <div>
          <span className="eyebrow">
            {data.restaurant.cuisine.toUpperCase()}
          </span>
          <h1>{data.restaurant.name}</h1>
          <p>{data.restaurant.description}</p>
          <div className="meta large-meta">
            <span>
              <Star size={15} fill="currentColor" />
              {data.restaurant.rating} rating
            </span>
            <span>
              <Clock3 size={15} />
              {data.restaurant.deliveryTime}
            </span>
            <span>Delivery ₹{data.restaurant.deliveryFee}</span>
          </div>
        </div>
      </div>
      <div className="menu-layout">
        <div>
          {groups.map((group) => (
            <section className="menu-group" key={group}>
              <h2>{group}</h2>
              <div className="menu-grid">
                {data.menu
                  .filter((i) => i.category === group)
                  .map((item) => (
                    <MenuItemCard
                      key={item._id}
                      item={item}
                      restaurant={data.restaurant}
                    />
                  ))}
              </div>
            </section>
          ))}
        </div>
        <aside className="menu-aside">
          <b>Hungry already?</b>
          <p>Add your favourites and head to checkout when you're ready.</p>
          <Link className="btn btn-dark full" to="/cart">
            View your cart
          </Link>
        </aside>
      </div>
    </div>
  );
}

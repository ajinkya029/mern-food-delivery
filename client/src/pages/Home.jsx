import React from "react";
import { useEffect, useMemo, useState } from "react";
import { Search, ArrowRight, Bike, ShieldCheck, Leaf } from "lucide-react";
import api from "../api";
import RestaurantCard from "../components/RestaurantCard";
const cuisines = ["All", "Indian", "Pizza", "Healthy", "Asian"];
export default function Home() {
  const [restaurants, setRestaurants] = useState([]),
    [search, setSearch] = useState(""),
    [cuisine, setCuisine] = useState("All"),
    [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  useEffect(() => {
    api
      .get("/restaurants")
      .then((r) => setRestaurants(r.data))
      .catch(() =>
        setError(
          "Could not load restaurants. Make sure the API and MongoDB are running.",
        ),
      )
      .finally(() => setLoading(false));
  }, []);
  const filtered = useMemo(
    () =>
      restaurants.filter(
        (r) =>
          (cuisine === "All" || r.cuisine === cuisine) &&
          `${r.name} ${r.cuisine}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [restaurants, cuisine, search],
  );
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <span></span> YOUR FAVOURITE FOOD, DELIVERED
            </span>
            <h1>
              Cravings don't
              <br />
              wait. <em>Neither do we.</em>
            </h1>
            <p>
              From local favourites to the dishes you love, get delicious food
              delivered right to your door.
            </p>
            <div className="hero-search">
              <Search size={20} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restaurants or cuisines..."
              />
              <button
                onClick={() =>
                  document
                    .getElementById("restaurants")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Find food <ArrowRight size={16} />
              </button>
            </div>
            <div className="hero-trust">
              <span>
                <Bike size={17} /> Fast delivery
              </span>
              <span>
                <ShieldCheck size={17} /> Safe & secure
              </span>
              <span>
                <Leaf size={17} /> Freshly made
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-photo">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?w=1000"
                alt="Colourful fresh meal"
              />
            </div>
            <div className="floating-note">
              <span>✦</span>
              <div>
                <b>Made fresh</b>
                <small>Just for you</small>
              </div>
            </div>
            <div className="hero-sticker">YUM!</div>
          </div>
        </div>
      </section>
      <section className="section wrap" id="restaurants">
        <div className="section-heading">
          <div>
            <span className="eyebrow">A WORLD OF FLAVOUR</span>
            <h2>What are you craving?</h2>
            <p>Find something delicious near you.</p>
          </div>
        </div>
        <div className="filters">
          {cuisines.map((c) => (
            <button
              key={c}
              className={cuisine === c ? "filter active" : "filter"}
              onClick={() => setCuisine(c)}
            >
              {c}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="empty-state">Finding delicious places...</div>
        ) : error ? (
          <div className="empty-state error">{error}</div>
        ) : filtered.length ? (
          <div className="restaurant-grid">
            {filtered.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            No restaurants found. Try another search.
          </div>
        )}
      </section>
      <section className="promo">
        <div className="wrap promo-inner">
          <div>
            <span className="eyebrow">GOOD FOOD IS A GOOD IDEA</span>
            <h2>
              Make today
              <br />a little tastier.
            </h2>
          </div>
          <div className="promo-emoji">🍜</div>
          <p>
            Pick your favourites, place an order, and let us take care of the
            rest.
          </p>
        </div>
      </section>
    </>
  );
}

import React from "react";
import { useEffect, useState } from "react";
import api from "../api";
const statuses = [
  "Placed",
  "Confirmed",
  "Preparing",
  "Out for delivery",
  "Delivered",
  "Cancelled",
];
export default function Admin() {
  const [orders, setOrders] = useState([]),
    [restaurants, setRestaurants] = useState([]),
    [form, setForm] = useState({
      name: "",
      description: "",
      cuisine: "Indian",
      image: "",
      deliveryTime: "25–35 min",
      deliveryFee: 35,
    }),
    [menu, setMenu] = useState({
      restaurant: "",
      name: "",
      description: "",
      category: "Popular",
      price: "",
      image: "",
      isVeg: true,
    }),
    [message, setMessage] = useState("");
  const load = () => api.get("/orders").then((r) => setOrders(r.data));
  useEffect(() => {
    load();
    api.get("/restaurants").then((r) => setRestaurants(r.data));
  }, []);
  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      load();
      setMessage("Order status updated.");
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not update status.");
    }
  };
  const createRestaurant = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/restaurants", {
        ...form,
        deliveryFee: Number(form.deliveryFee),
      });
      setRestaurants((r) => [...r, data]);
      setForm({
        name: "",
        description: "",
        cuisine: "Indian",
        image: "",
        deliveryTime: "25–35 min",
        deliveryFee: 35,
      });
      setMessage("Restaurant created.");
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not create restaurant.");
    }
  };
  const createMenu = async (e) => {
    e.preventDefault();
    try {
      await api.post("/menu", { ...menu, price: Number(menu.price) });
      setMenu({ ...menu, name: "", description: "", price: "", image: "" });
      setMessage("Menu item created.");
    } catch (e) {
      setMessage(e.response?.data?.message || "Could not create menu item.");
    }
  };
  return (
    <div className="wrap admin-page">
      <div className="page-heading">
        <span className="eyebrow">QUICKBITE CONTROL ROOM</span>
        <h1>Admin dashboard</h1>
        <p>Manage incoming orders and your restaurant catalogue.</p>
      </div>
      {message && (
        <div className="notice">
          {message}
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}
      <section className="admin-section">
        <div className="admin-section-title">
          <h2>Incoming orders</h2>
          <button className="text-button" onClick={load}>
            Refresh
          </button>
        </div>
        {orders.length === 0 ? (
          <p className="muted">No orders have been placed yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>
                      #{o._id.slice(-7).toUpperCase()}
                      <small>{new Date(o.createdAt).toLocaleString()}</small>
                    </td>
                    <td>
                      {o.user?.name || "Customer"}
                      <small>{o.phone}</small>
                    </td>
                    <td>
                      {o.items
                        .map((i) => `${i.quantity}× ${i.name}`)
                        .join(", ")}
                    </td>
                    <td>₹{o.total}</td>
                    <td>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value)}
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <div className="admin-forms">
        <form className="admin-form" onSubmit={createRestaurant}>
          <h2>Add restaurant</h2>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Description
            <input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>
          <label>
            Cuisine
            <input
              value={form.cuisine}
              onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
            />
          </label>
          <label>
            Image URL
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </label>
          <div className="two-fields">
            <label>
              Delivery time
              <input
                value={form.deliveryTime}
                onChange={(e) =>
                  setForm({ ...form, deliveryTime: e.target.value })
                }
              />
            </label>
            <label>
              Fee (₹)
              <input
                type="number"
                min="0"
                value={form.deliveryFee}
                onChange={(e) =>
                  setForm({ ...form, deliveryFee: e.target.value })
                }
              />
            </label>
          </div>
          <button className="btn btn-primary full">Create restaurant</button>
        </form>
        <form className="admin-form" onSubmit={createMenu}>
          <h2>Add menu item</h2>
          <label>
            Restaurant
            <select
              required
              value={menu.restaurant}
              onChange={(e) => setMenu({ ...menu, restaurant: e.target.value })}
            >
              <option value="">Choose restaurant</option>
              {restaurants.map((r) => (
                <option key={r._id} value={r._id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Item name
            <input
              required
              value={menu.name}
              onChange={(e) => setMenu({ ...menu, name: e.target.value })}
            />
          </label>
          <label>
            Description
            <input
              value={menu.description}
              onChange={(e) =>
                setMenu({ ...menu, description: e.target.value })
              }
            />
          </label>
          <div className="two-fields">
            <label>
              Category
              <input
                value={menu.category}
                onChange={(e) => setMenu({ ...menu, category: e.target.value })}
              />
            </label>
            <label>
              Price (₹)
              <input
                type="number"
                min="1"
                required
                value={menu.price}
                onChange={(e) => setMenu({ ...menu, price: e.target.value })}
              />
            </label>
          </div>
          <label>
            Image URL
            <input
              value={menu.image}
              onChange={(e) => setMenu({ ...menu, image: e.target.value })}
            />
          </label>
          <label className="check-label">
            <input
              type="checkbox"
              checked={menu.isVeg}
              onChange={(e) => setMenu({ ...menu, isVeg: e.target.checked })}
            />{" "}
            Vegetarian
          </label>
          <button className="btn btn-primary full">Create menu item</button>
        </form>
      </div>
    </div>
  );
}

import React from "react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";
import api from "../api";
import { useApp } from "../context/AppContext";
export default function Auth({ mode = "login" }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post(
        `/auth/${isRegister ? "register" : "login"}`,
        form,
      );
      login(data);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand">
          <span className="brand-icon">
            <UtensilsCrossed />
          </span>
        </div>
        <span className="eyebrow">WELCOME TO QUICKBITE</span>
        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p>
          {isRegister
            ? "Your next favourite meal is just a few clicks away."
            : "Sign in to order your favourites again."}
        </p>
        {isRegister && (
          <label>
            Full name
            <input
              required
              minLength="2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
            />
          </label>
        )}
        <label>
          Email address
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength="6"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"
          />
        </label>
        {error && <div className="form-error">{error}</div>}
        <button className="btn btn-primary full" disabled={busy}>
          {busy ? "Please wait..." : isRegister ? "Create account" : "Sign in"}
        </button>
        <div className="auth-switch">
          {isRegister ? "Already have an account?" : "New to QuickBite?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </div>
      </form>
    </div>
  );
}

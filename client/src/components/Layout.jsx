import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, UserRound, LogOut, UtensilsCrossed } from "lucide-react";
import { useApp } from "../context/AppContext";
export default function Layout({ children }) {
  const { user, logout, cart } = useApp();
  const navigate = useNavigate();
  return (
    <>
      <header className="header">
        <div className="nav wrap">
          <Link to="/" className="brand">
            <span className="brand-icon">
              <UtensilsCrossed size={20} />
            </span>
            quick<span>bite</span>
          </Link>
          <nav>
            <NavLink to="/">Explore</NavLink>
            {user && <NavLink to="/orders">My orders</NavLink>}
            {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
          </nav>
          <div className="nav-actions">
            <Link className="cart-link" to="/cart">
              <ShoppingBag size={19} />
              <span>Cart</span>
              {cart.length > 0 && (
                <b>{cart.reduce((n, i) => n + i.quantity, 0)}</b>
              )}
            </Link>
            {user ? (
              <button
                className="user-pill"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                title="Sign out"
              >
                <UserRound size={17} />
                <span>{user.name.split(" ")[0]}</span>
                <LogOut size={15} />
              </button>
            ) : (
              <Link className="btn btn-dark btn-small" to="/login">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <div className="brand">
            <span className="brand-icon">
              <UtensilsCrossed size={18} />
            </span>
            quick<span>bite</span>
          </div>
          <p>Good food. Good mood. Delivered.</p>
          <small>© {new Date().getFullYear()} QuickBite</small>
        </div>
      </footer>
    </>
  );
}

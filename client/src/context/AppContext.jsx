import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api from "../api";
const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qb_user"));
    } catch {
      return null;
    }
  });
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("qb_cart")) || [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState("");
  useEffect(() => {
    localStorage.setItem("qb_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(timer);
  }, [toast]);
  const notify = (message) => setToast(message);
  const login = (data) => {
    localStorage.setItem("qb_token", data.token);
    localStorage.setItem("qb_user", JSON.stringify(data.user));
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem("qb_token");
    localStorage.removeItem("qb_user");
    setUser(null);
    setCart([]);
  };
  const addToCart = (item, restaurant) => {
    setCart((current) => {
      if (current.length && current[0].restaurantId !== restaurant._id) {
        notify("Your cart can contain items from one restaurant.");
        return current;
      }
      const found = current.find((i) => i._id === item._id);
      return found
        ? current.map((i) =>
            i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i,
          )
        : [
            ...current,
            {
              ...item,
              quantity: 1,
              restaurantId: restaurant._id,
              restaurantName: restaurant.name,
              deliveryFee: restaurant.deliveryFee,
            },
          ];
    });
    notify(`${item.name} added to cart`);
  };
  const changeQty = (id, amount) =>
    setCart((current) =>
      current
        .map((i) =>
          i._id === id ? { ...i, quantity: i.quantity + amount } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  const clearCart = () => setCart([]);
  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );
  return (
    <AppContext.Provider
      value={{
        user,
        cart,
        toast,
        notify,
        login,
        logout,
        addToCart,
        changeQty,
        clearCart,
        subtotal,
      }}
    >
      {children}
      {toast && <div className="toast">{toast}</div>}
    </AppContext.Provider>
  );
}
export const useApp = () => useContext(AppContext);

import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.post('/', asyncHandler(async (req, res) => {
  const { items, deliveryAddress, phone, paymentMethod = 'cash' } = req.body;
  if (!Array.isArray(items) || !items.length || !deliveryAddress?.trim() || !phone?.trim()) return res.status(400).json({ message: 'Add items, delivery address and phone number.' });
  const ids = items.map(i => i.menuItem);
  const menuItems = await MenuItem.find({ _id: { $in: ids }, available: true }).populate('restaurant');
  if (menuItems.length !== items.length) return res.status(400).json({ message: 'One or more menu items are unavailable.' });
  const restaurantIds = [...new Set(menuItems.map(i => String(i.restaurant._id)))];
  if (restaurantIds.length !== 1) return res.status(400).json({ message: 'Please order from one restaurant at a time.' });
  const normalized = menuItems.map(menu => {
    const requested = items.find(i => String(i.menuItem) === String(menu._id));
    const quantity = Math.min(20, Math.max(1, Number(requested.quantity) || 1));
    return { menuItem: menu._id, name: menu.name, image: menu.image, quantity, price: menu.price };
  });
  const subtotal = normalized.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFee = menuItems[0].restaurant.deliveryFee || 0;
  const order = await Order.create({ user: req.user._id, items: normalized, deliveryAddress, phone, subtotal, deliveryFee, total: subtotal + deliveryFee, paymentMethod });
  res.status(201).json(order);
}));
router.get('/my', asyncHandler(async (req, res) => res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }))));
router.get('/', adminOnly, asyncHandler(async (req, res) => res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }))));
router.patch('/:id/status', adminOnly, asyncHandler(async (req, res) => {
  const allowed = ['Placed', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Invalid order status.' });
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found.' }); res.json(order);
}));
export default router;

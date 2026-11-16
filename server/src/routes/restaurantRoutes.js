import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import Restaurant from '../models/Restaurant.js';
import MenuItem from '../models/MenuItem.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.get('/', asyncHandler(async (req, res) => {
  const filter = { isActive: true };
  if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search, 'i') }, { cuisine: new RegExp(req.query.search, 'i') }];
  if (req.query.cuisine && req.query.cuisine !== 'All') filter.cuisine = req.query.cuisine;
  res.json(await Restaurant.find(filter).sort({ rating: -1 }));
}));
router.get('/:id', asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant || !restaurant.isActive) return res.status(404).json({ message: 'Restaurant not found.' });
  const menu = await MenuItem.find({ restaurant: restaurant._id, available: true }).sort({ category: 1, name: 1 });
  res.json({ restaurant, menu });
}));
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => res.status(201).json(await Restaurant.create(req.body))));
export default router;

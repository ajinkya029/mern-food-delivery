import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import MenuItem from '../models/MenuItem.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => res.status(201).json(await MenuItem.create(req.body))));
router.patch('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Menu item not found.' }); res.json(item);
}));
export default router;

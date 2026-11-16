import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { makeToken } from '../utils/token.js';
const safeUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role });
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  if (await User.findOne({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name, email, password });
  res.status(201).json({ user: safeUser(user), token: makeToken(user._id) });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password || ''))) return res.status(401).json({ message: 'Email or password is incorrect.' });
  res.json({ user: safeUser(user), token: makeToken(user._id) });
});
export const me = asyncHandler(async (req, res) => res.json({ user: safeUser(req.user) }));

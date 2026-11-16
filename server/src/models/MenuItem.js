import mongoose from 'mongoose';
const menuItemSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true }, description: String, category: { type: String, default: 'Popular' },
  price: { type: Number, required: true, min: 1 }, image: String, isVeg: { type: Boolean, default: true }, available: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('MenuItem', menuItemSchema);

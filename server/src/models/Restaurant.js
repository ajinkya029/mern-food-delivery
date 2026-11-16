import mongoose from 'mongoose';
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, description: String,
  cuisine: { type: String, default: 'Multi-cuisine' }, image: String,
  rating: { type: Number, default: 4.5 }, deliveryTime: { type: String, default: '25–35 min' },
  deliveryFee: { type: Number, default: 35 }, isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Restaurant', restaurantSchema);

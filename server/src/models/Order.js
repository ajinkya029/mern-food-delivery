import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }, name: String, image: String, quantity: Number, price: Number }],
  deliveryAddress: { type: String, required: true }, phone: { type: String, required: true },
  subtotal: Number, deliveryFee: Number, total: Number,
  paymentMethod: { type: String, enum: ['cash', 'online'], default: 'cash' },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  status: { type: String, enum: ['Placed', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered', 'Cancelled'], default: 'Placed' }
}, { timestamps: true });
export default mongoose.model('Order', orderSchema);

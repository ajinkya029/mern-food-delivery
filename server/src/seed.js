import 'dotenv/config';
import connectDB from './config/db.js';
import User from './models/User.js';
import Restaurant from './models/Restaurant.js';
import MenuItem from './models/MenuItem.js';
await connectDB();
await Promise.all([User.deleteMany({}), Restaurant.deleteMany({}), MenuItem.deleteMany({})]);
await User.create({ name: 'QuickBite Admin', email: 'admin@quickbite.dev', password: 'Admin123!', role: 'admin' });
const restaurants = await Restaurant.insertMany([
 { name: 'The Bombay Kitchen', cuisine: 'Indian', description: 'Comforting Indian classics, made fresh.', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000', rating: 4.8, deliveryTime: '20–30 min', deliveryFee: 30 },
 { name: 'Napoli Pizza Co.', cuisine: 'Pizza', description: 'Wood-fired favourites and cheesy goodness.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000', rating: 4.6, deliveryTime: '25–35 min', deliveryFee: 40 },
 { name: 'Green Bowl', cuisine: 'Healthy', description: 'Fresh bowls, wraps and feel-good food.', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000', rating: 4.7, deliveryTime: '15–25 min', deliveryFee: 25 },
 { name: 'Wok This Way', cuisine: 'Asian', description: 'Street-style Asian dishes with a twist.', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1000', rating: 4.5, deliveryTime: '30–40 min', deliveryFee: 35 }
]);
const foods = [
 ['Paneer Butter Masala','Creamy tomato gravy with soft paneer.','Main Course',249,true,0,'photo-1631452180519-c014fe946bc7'],
 ['Chicken Biryani','Fragrant basmati rice and aromatic spices.','Biryani',299,false,0,'photo-1563379091339-03246963d96c'],
 ['Masala Dosa','Crisp dosa with potato masala.','South Indian',149,true,0,'photo-1589301760014-d929f3979dbc'],
 ['Margherita Pizza','Classic tomato, mozzarella and basil.','Pizza',279,true,1,'photo-1574071318508-1cdbab80d002'],
 ['Farmhouse Pizza','Loaded with fresh vegetables and cheese.','Pizza',359,true,1,'photo-1604382355076-af4b0eb60143'],
 ['Pesto Power Bowl','Greens, grains, avocado and pesto dressing.','Bowls',269,true,2,'photo-1512621776951-a57141f2eefd'],
 ['Crispy Tofu Bowl','Crispy tofu with rice and crunchy veg.','Bowls',239,true,2,'photo-1546069901-ba9599a7e63c'],
 ['Chilli Garlic Noodles','Wok-tossed noodles with chilli and garlic.','Noodles',229,true,3,'photo-1569718212165-3a8278d5f624'],
 ['Veg Manchurian','Crispy veggie bites in savoury sauce.','Starters',189,true,3,'photo-1512058564366-18510be2db19']
];
await MenuItem.insertMany(foods.map(([name,description,category,price,isVeg,index,image]) => ({ name, description, category, price, isVeg, restaurant: restaurants[index]._id, image: `https://images.unsplash.com/${image}?w=700` })));
console.log('Seed complete. Admin: admin@quickbite.dev / Admin123!'); process.exit(0);

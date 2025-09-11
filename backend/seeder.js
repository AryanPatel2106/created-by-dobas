import mongoose from 'mongoose';
import dotenv from 'dotenv';
import products from './data/products.js';
import Product from './models/productModel.js';
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
  try {
    // First, connect to the database using the MONGO_URI from .env
    await connectDB();

    // Clear existing products
    await Product.deleteMany();

    // Insert the new products
    await Product.insertMany(products);

    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    console.log('Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error with data destruction: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
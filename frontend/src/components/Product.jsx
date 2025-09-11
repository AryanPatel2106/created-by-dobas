import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Rating from './Rating';

const Product = ({ product }) => (
  <Link to={`/product/${product._id}`} className="block group">
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-72 object-cover" 
        />
        <div className="absolute top-3 right-3 bg-white/80 p-2 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 ease-in-out backdrop-blur-sm">
          <ArrowUpRight className="text-gray-700" />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-grow">{product.name}</h3>
        <div className="mt-2">
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>
        <p className="text-gray-800 mt-2 text-xl font-bold">₹{product.price}</p>
      </div>
    </div>
  </Link>
);

export default Product;
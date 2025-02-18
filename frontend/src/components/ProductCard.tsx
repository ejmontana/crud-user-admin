import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
  category: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, image, category }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <span className="text-sm text-blue-600 font-medium">{category}</span>
        <h3 className="text-lg font-semibold mt-1">{name}</h3>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${price}</span>
          <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
import { Search, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full bg-white">
      <div className="pr-6 pl-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-black">ECOMMERCE</h1>
          </div>

          <nav className="hidden md:flex space-x-8 font-semibold">
              <a href="#" className="text-gray-700 hover:text-black transition-colors">Categories</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">Sale</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">Clearance</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">New stock</a>
              <a href="#" className="text-gray-700 hover:text-black transition-colors">Trending</a>
            </nav>
          
          <div className="flex items-center space-x-4">
            <Search className="h-5 w-5 text-gray-600 cursor-pointer" />
            <ShoppingCart className="h-5 w-5 text-gray-600 cursor-pointer" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4">
            <button className="text-gray-600">&lt;</button>
            <span className="text-sm text-gray-700">Get 10% off on business sign up</span>
            <button className="text-gray-600">&gt;</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

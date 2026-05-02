import { useState } from "react";
import { Link } from "react-router-dom";
import { User, ShoppingCart, LogOut, Package, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";

export const NavActions = ({ setIsLoginModalOpen }: { setIsLoginModalOpen: (open: boolean) => void }) => {
  const { cartItems } = useCart();
  const { user, isAuthenticated, logout } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="flex items-center gap-1 sm:gap-2 ml-auto">
      {/* Wishlist Button */}
      <button className="hidden lg:flex flex-col items-center gap-0.5 group px-2">
        <div className="relative">
          <Heart className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
        </div>
        <span className="text-[10px] font-bold text-gray-500 group-hover:text-primary">Wishlist</span>
      </button>

      {/* Cart Indicator with Label */}
      <div className="flex flex-col items-center gap-0.5 group cursor-pointer px-2">
        <div className="relative">
          <ShoppingCart className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">
              {cartItems.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-bold text-gray-500 group-hover:text-primary">Cart</span>
      </div>

      {isAuthenticated ? (
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex flex-col items-center gap-0.5 group px-2 outline-none"
          >
            <User className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold text-gray-500 group-hover:text-primary">
              {user?.firstName || 'Account'}
            </span>
          </button>
          
          {isUserMenuOpen && (
            <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-100 rounded-xl shadow-high z-50 overflow-hidden animate-slide-up">
              <div className="p-1.5">
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="h-4 w-4 text-gray-400" />
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Package className="h-4 w-4 text-gray-400" />
                  My Orders
                </Link>
                <div className="border-t border-gray-50 my-1"></div>
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg w-full text-left transition-colors font-bold"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="flex flex-col items-center gap-0.5 group px-2"
        >
          <User className="h-5 w-5 text-gray-700 group-hover:text-primary transition-colors" />
          <span className="text-[10px] font-bold text-gray-500 group-hover:text-primary">Login</span>
        </button>
      )}
    </div>
  );
};

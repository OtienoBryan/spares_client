import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { useUser } from "@/contexts/UserContext";
import { useNavigationCategories } from "@/hooks/useNavigationCategories";
import { LoginModal } from "@/components/auth/LoginModal";
import { RegisterModal } from "@/components/auth/RegisterModal";

import { Link, useLocation } from "react-router-dom";
import { CartSidebar } from "@/components/ui/cart-sidebar";

import { NavSystemDropdown } from "./nav/NavSystemDropdown";
import { NavTopBar } from "./nav/NavTopBar";
import { NavLogo } from "./nav/NavLogo";
import { NavSearch } from "./nav/NavSearch";
import { NavActions } from "./nav/NavActions";
import { NavMobileMenu } from "./nav/NavMobileMenu";
import { PhoneCall, Menu } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  
  const { cartItems, updateQuantity, removeItem } = useCart();
  const { user, isAuthenticated, logout } = useUser();
  const { categories, loading: categoriesLoading, error: categoriesError } = useNavigationCategories();

  const isActiveCategory = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path;
  };

  return (
    <>
      <NavTopBar />

      <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
        {/* Row 1: Main Header */}
        <div className="container mx-auto px-4 py-4 sm:py-5">
          <div className="flex items-center justify-between gap-8 md:gap-12">
            <NavLogo />
            
            <div className="hidden md:flex flex-1">
              <NavSearch />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden lg:block border-r border-gray-100 pr-4 mr-2">
                 <NavActions setIsLoginModalOpen={setIsLoginModalOpen} />
              </div>
              
              <div className="md:hidden">
                <NavActions setIsLoginModalOpen={setIsLoginModalOpen} />
              </div>

              {/* Cart Sidebar Drawer */}
              <CartSidebar 
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
              />

              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Secondary Navigation */}
        <div className="hidden md:block border-t border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <NavSystemDropdown categories={categories} />
                <div className="h-10 w-px bg-gray-100 mx-6"></div>
                
                <div className="flex items-center gap-8">
                   <Link to="/catalog" className={`text-sm font-bold transition-all flex items-center gap-1.5 ${location.pathname === '/catalog' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                     Parts Catalog
                     <span className="bg-emerald-50 text-emerald-600 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">New</span>
                   </Link>
                   <Link to="/" className={`text-sm font-bold transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}>
                     Dashboard
                   </Link>
                   <Link to="/category/offers" className="text-sm font-bold text-gray-700 hover:text-primary transition-all flex items-center gap-1.5">
                     Deals of the Week
                     <span className="bg-red-50 text-red-500 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse">Hot</span>
                   </Link>
                   <Link to="/featured" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">
                     Verified Spares
                   </Link>
                   <Link to="/brands" className="text-sm font-bold text-gray-700 hover:text-primary transition-colors">
                     Browse Brands
                   </Link>
                   <Link to="/category/sale" className="text-sm font-bold text-gray-700 hover:text-primary transition-all flex items-center gap-1.5">
                     Clearance
                     <span className="bg-blue-50 text-blue-500 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">Sale</span>
                   </Link>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Expert Help</span>
                   <a href="tel:+254123456789" className="text-sm font-black text-gray-900 flex items-center gap-1 hover:text-primary transition-colors">
                     <PhoneCall className="h-3 w-3" />
                     +254 712 345 678
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <NavMobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={categories}
        categoriesLoading={categoriesLoading}
        categoriesError={categoriesError}
        isAuthenticated={isAuthenticated}
        user={user}
        logout={logout}
        isActiveCategory={isActiveCategory}
      />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
};

export default Navigation;

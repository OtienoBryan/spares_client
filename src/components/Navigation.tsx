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
        <div className="w-full px-4 md:px-6 py-4 sm:py-5">
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

        {/* Row 2: Secondary Navigation (Automotive Category Bar) */}
        <div className="hidden md:block bg-[#1d2736] text-white">
          <div className="w-full">
            <div className="flex items-stretch overflow-hidden">
              {/* All Systems Dropdown (Integrated into the bar) */}
              <div className="flex items-center bg-primary px-6 hover:bg-primary/90 transition-colors cursor-pointer border-r border-white/10">
                <NavSystemDropdown categories={categories} />
              </div>
              
              {/* Main Categories */}
              {[
                { label: "Exterior Car Accessories", path: "/catalog?cat=Exterior" },
                { label: "Interior Car Accessories", path: "/catalog?cat=Interior" },
                { label: "Car Service Parts", path: "/catalog?cat=Service" },
                { label: "Batteries & Bulbs", path: "/catalog?cat=Electrical" },
                { label: "Car Safety Accessories", path: "/catalog?cat=Safety" },
                { label: "Car Security Systems", path: "/catalog?cat=Security" },
                { label: "Other Spare Parts", path: "/catalog?cat=Spares" },
                { label: "Other Car Accessories", path: "/catalog?cat=Accessories" }
              ].map((item, index) => (
                <Link 
                  key={index}
                  to={item.path} 
                  className="flex-1 flex items-center justify-center text-center px-2 py-3.5 text-[11px] lg:text-[13px] font-black uppercase tracking-tight hover:bg-white/10 transition-colors border-r border-white/10 last:border-r-0"
                >
                  {item.label}
                </Link>
              ))}

              {/* Expert Help (Moved into the bar or right-aligned) */}
              <div className="hidden lg:flex items-center gap-2 px-6 bg-black/10 border-l border-white/10 ml-auto">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest">Expert Help</span>
                   <a href="tel:254790831798" className="text-xs font-black text-white flex items-center gap-1 hover:text-primary transition-colors">
                     <PhoneCall className="h-3 w-3" />
                     254790 831798
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

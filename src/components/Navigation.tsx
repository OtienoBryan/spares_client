import { useState } from "react";
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
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/config/site";

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
      <header className="sticky top-0 z-50 shadow-sm">
      <NavTopBar />

      <nav className="bg-white border-b border-gray-100">
        {/* Row 1: Main Header */}
        <div className="w-full px-4 md:px-6 py-1">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            <NavLogo />
            
            <div className="hidden md:flex flex-1 min-w-0">
              <NavSearch />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden lg:block border-r border-gray-100 pr-2 mr-1">
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

        {/* Mobile: search (desktop search lives in row 1) */}
        <div className="border-b border-gray-100 bg-white md:hidden">
          <div className="px-2 pb-1.5 pt-0.5">
            <NavSearch layout="toolbar" />
          </div>
        </div>

        {/* Mobile: category badges (desktop uses left sidebar + blue bar) */}
        <div className="border-b border-gray-100 bg-slate-50 md:hidden">
          <div className="px-3 py-2">
            <p className="mb-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-500">
              Shop by category
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
              {categoriesLoading
                ? [...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-20 shrink-0 animate-pulse rounded-full bg-slate-200/90"
                      aria-hidden
                    />
                  ))
                : (categories ?? []).map((cat) => {
                    const Icon = cat.icon;
                    const active =
                      cat.path === "/"
                        ? location.pathname === "/"
                        : location.pathname.startsWith(cat.path);
                    return (
                      <Link
                        key={cat.path}
                        to={cat.path}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1.5 text-[10px] font-semibold leading-none shadow-sm transition-colors ${
                          active
                            ? "border-primary/50 bg-primary text-white"
                            : "border-slate-200 bg-white text-slate-800 hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary"
                        }`}
                      >
                        {Icon ? (
                          <Icon
                            className={`h-3 w-3 shrink-0 ${active ? "text-white" : "text-primary"}`}
                            aria-hidden
                          />
                        ) : null}
                        <span className="max-w-[6.5rem] truncate">{cat.name}</span>
                      </Link>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* Row 2: Secondary Navigation (Automotive Category Bar) */}
        <div className="hidden md:block bg-[#1d2736] text-white">
          <div className="w-full">
            <div className="flex min-w-0 items-stretch">
              {/* All Systems Dropdown (Integrated into the bar) */}
              <div className="flex items-center bg-primary px-6 hover:bg-primary/90 transition-colors cursor-pointer border-r border-white/10">
                <NavSystemDropdown categories={categories} />
              </div>
              
              {/* Main categories — same routes as sidebar / All Systems (`/category/:slug`) */}
              {categoriesLoading ? (
                [...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 border-r border-white/10 px-2 py-3.5"
                    aria-hidden
                  >
                    <div className="mx-auto h-3 w-20 animate-pulse rounded bg-white/20" />
                  </div>
                ))
              ) : (
                categories.slice(0, 8).map((category, index, arr) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className={`flex min-w-0 flex-1 items-center justify-center px-2 py-3.5 text-center text-[10px] font-black uppercase leading-tight tracking-tight text-white transition-colors hover:bg-white/10 lg:text-[12px] ${
                      index < arr.length - 1
                        ? "border-r border-white/10"
                        : "border-r-0 lg:border-r lg:border-white/10"
                    }`}
                  >
                    <span className="line-clamp-2">{category.name}</span>
                  </Link>
                ))
              )}

              {/* Expert Help (Moved into the bar or right-aligned) */}
              <div className="hidden lg:flex items-center gap-2 px-6 bg-black/10 border-l border-white/10 ml-auto">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] text-white/60 font-bold uppercase tracking-widest">Expert Help</span>
                   <a href={`tel:${CONTACT_PHONE_TEL}`} className="text-xs font-black text-white flex items-center gap-1 hover:text-primary transition-colors">
                     <PhoneCall className="h-3 w-3" />
                     {CONTACT_PHONE_DISPLAY}
                   </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      </header>

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

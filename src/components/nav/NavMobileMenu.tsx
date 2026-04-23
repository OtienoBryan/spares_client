import { Link } from "react-router-dom";
import { X, User, Phone, MapPin, Package, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingSpares } from "@/components/ui/lottie-loader";
import { COMPANY_SHORT_NAME, LOGO_ALT, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/config/site";

interface NavMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: any[];
  categoriesLoading: boolean;
  categoriesError: any;
  isAuthenticated: boolean;
  user: any;
  logout: () => void;
  isActiveCategory: (path: string) => boolean;
}

export const NavMobileMenu = ({
  isOpen,
  onClose,
  categories,
  categoriesLoading,
  categoriesError,
  isAuthenticated,
  user,
  logout,
  isActiveCategory
}: NavMobileMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden" onClick={onClose}>
      <div className="bg-white w-[280px] sm:w-[320px] h-full p-5 overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center p-1">
              <img src="/logo3.png" alt={LOGO_ALT} className="h-full w-full object-contain" />
            </div>
            <span className="text-xl font-bold text-primary">{COMPANY_SHORT_NAME}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info if Logged In */}
        {isAuthenticated && (
          <div className="bg-muted/30 rounded-xl p-4 mb-6 border border-muted">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                {user?.firstName?.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="font-bold truncate text-sm">Hello, {user?.firstName}</div>
                <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/account" onClick={onClose} className="flex items-center gap-1.5 p-2 bg-white rounded-lg text-xs font-semibold shadow-sm border border-muted/50">
                <User className="h-3 w-3" /> Profile
              </Link>
              <Link to="/orders" onClick={onClose} className="flex items-center gap-1.5 p-2 bg-white rounded-lg text-xs font-semibold shadow-sm border border-muted/50">
                <Package className="h-3 w-3" /> Orders
              </Link>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Catalog CTA */}
          <Link
            to="/catalog"
            className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl text-primary font-bold text-sm hover:bg-primary/10 transition-colors"
            onClick={onClose}
          >
            <span className="text-xl" role="img">📋</span>
            Parts Catalog
            <span className="ml-auto bg-emerald-100 text-emerald-700 text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase">New</span>
          </Link>

          <div>
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-widest mb-4">Spare Categories</h3>
            {categoriesLoading ? (
              <div className="flex items-center gap-3 py-4 text-sm text-muted-foreground">
                <LoadingSpares size="sm" />
                <span>Loading components...</span>
              </div>
            ) : categoriesError ? (
              <div className="text-xs text-destructive text-center py-4">Error loading categories</div>
            ) : (
              <div className="grid gap-1">
                {categories.map((category) => (
                  <Link
                    key={category.path}
                    to={category.path}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all ${
                      isActiveCategory(category.path)
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-primary border border-transparent"
                    }`}
                    onClick={onClose}
                  >
                    <span className="text-xl" role="img">{category.icon}</span>
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-widest mb-4">Support</h3>
            <div className="space-y-3">
              <a href={`tel:${CONTACT_PHONE_TEL}`} className="flex items-center gap-3 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </div>
                {CONTACT_PHONE_DISPLAY}
              </a>
              <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                Nairobi, Kenya
              </div>
            </div>
          </div>

          {isAuthenticated && (
            <div className="pt-6">
              <Button 
                variant="outline" 
                className="w-full text-red-600 border-red-100 hover:bg-red-50"
                onClick={() => { logout(); onClose(); }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

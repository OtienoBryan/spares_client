import { Link } from "react-router-dom";
import { X, User, Phone, MapPin, Package, LogOut, LayoutDashboard, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div
      className="fixed inset-0 z-[100] bg-slate-900/45 backdrop-blur-[3px] md:hidden animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex h-full w-[min(100%,20rem)] flex-col overflow-hidden border-r border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50/95 shadow-2xl sm:w-[22rem] animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="shrink-0 border-b border-slate-200/80 bg-white/70 px-4 pb-4 pt-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-sm">
                <img src="/icon.svg" alt={LOGO_ALT} className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-base font-bold tracking-tight text-slate-900">{COMPANY_SHORT_NAME}</div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Menu</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-9 w-9 shrink-0 rounded-full border border-slate-200/80 bg-white/80 p-0 hover:bg-slate-50"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-slate-600" />
            </Button>
          </div>
          <div className="h-0.5 w-12 rounded-full bg-gradient-to-r from-primary to-primary/50" aria-hidden />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 pb-4 pt-4">
          {/* Categories first so they’re visible without scrolling past other blocks */}
          <div className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Categories
            </h3>
            <p className="mb-2 text-[10px] text-slate-500">Tap a badge to browse parts.</p>
            {categoriesLoading ? (
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-20 animate-pulse rounded-full bg-slate-200/90"
                    aria-hidden
                  />
                ))}
              </div>
            ) : categoriesError ? (
              <div className="rounded-lg border border-red-100 bg-red-50/60 px-2 py-2 text-center text-[11px] text-destructive">
                Could not load categories
              </div>
            ) : !(categories && categories.length) ? (
              <p className="text-center text-[11px] text-slate-500">No categories available.</p>
            ) : (
              <nav className="flex flex-wrap gap-2" aria-label="Shop by category">
                {(categories ?? []).map((category) => {
                  const active = isActiveCategory(category.path);
                  const Icon = category.icon;
                  return (
                    <Link
                      key={category.path}
                      to={category.path}
                      onClick={onClose}
                      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-2 text-[11px] font-semibold leading-tight text-slate-800 shadow-sm transition-colors ${
                        active
                          ? "border-primary/50 bg-primary text-white"
                          : "border-slate-300 bg-slate-50 hover:border-primary/40 hover:bg-primary/[0.08] hover:text-primary"
                      }`}
                    >
                      {Icon ? (
                        <Icon
                          className={`h-3.5 w-3.5 shrink-0 ${active ? "text-white" : "text-primary"}`}
                          aria-hidden
                        />
                      ) : null}
                      <span className="min-w-0 max-w-[10.5rem] truncate">{category.name}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          <div className="space-y-5">
            {isAuthenticated && (
              <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {user?.firstName?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">Hello, {user?.firstName}</div>
                    <div className="truncate text-xs text-slate-500">{user?.email}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-primary/25 hover:bg-primary/[0.06] hover:text-primary"
                  >
                    <User className="h-3.5 w-3.5" /> Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={onClose}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 py-2.5 text-xs font-semibold text-slate-800 transition-colors hover:border-primary/25 hover:bg-primary/[0.06] hover:text-primary"
                  >
                    <Package className="h-3.5 w-3.5" /> Orders
                  </Link>
                </div>
              </div>
            )}

            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                isActiveCategory("/")
                  ? "border-primary/25 bg-white text-primary shadow-sm ring-1 ring-primary/10"
                  : "border-transparent text-slate-600 hover:border-slate-200/90 hover:bg-white hover:text-primary hover:shadow-sm"
              }`}
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                  isActiveCategory("/") ? "bg-primary/15 text-primary" : "bg-slate-100/90 text-primary/80"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
              </span>
              Dashboard
            </Link>

            <Link
              to="/catalog"
              className="flex items-center gap-3 rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/[0.08] to-transparent px-4 py-3.5 text-sm font-bold text-primary shadow-sm transition-all hover:border-primary/35 hover:from-primary/[0.12]"
              onClick={onClose}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ClipboardList className="h-4 w-4" />
              </span>
              <span className="flex-1">Parts catalog</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-emerald-700">
                New
              </span>
            </Link>

            <div className="border-t border-slate-200/80 pt-5">
              <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Support</h3>
              <div className="space-y-2">
                <a
                  href={`tel:${CONTACT_PHONE_TEL}`}
                  className="flex items-center gap-3 rounded-xl border border-transparent px-2 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-200/80 hover:bg-white"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  {CONTACT_PHONE_DISPLAY}
                </a>
                <div className="flex items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium text-slate-700">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  Nairobi, Kenya
                </div>
              </div>
            </div>

            {isAuthenticated && (
              <Button
                variant="outline"
                className="w-full rounded-xl border-red-200/80 text-red-600 hover:bg-red-50"
                onClick={() => {
                  logout();
                  onClose();
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

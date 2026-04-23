import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

interface NavSystemDropdownProps {
  categories: any[];
}

export const NavSystemDropdown = ({ categories }: NavSystemDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-primary-light transition-all active:scale-95 shadow-md shadow-primary/20"
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        <span>All Systems</span>
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-high z-[60] overflow-hidden animate-slide-up">
          <div className="py-2">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                onClick={() => setIsOpen(false)}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">{category.icon}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
            <div className="border-t border-gray-50 my-1"></div>
            <Link
              to="/categories"
              className="flex items-center justify-center py-2 text-xs font-bold text-primary hover:underline"
              onClick={() => setIsOpen(false)}
            >
              View All Categories
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

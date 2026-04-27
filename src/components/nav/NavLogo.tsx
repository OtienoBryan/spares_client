import { Link } from "react-router-dom";
import { COMPANY_NAME, COMPANY_SHORT_NAME, LOGO_ALT } from "@/config/site";

export const NavLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 shrink-0 group">
      <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full overflow-hidden flex items-center justify-center p-0.5 bg-gray-50 border border-gray-100 group-hover:border-primary/30 transition-colors">
        <img 
          src="/icon.svg"
          alt={LOGO_ALT}
          className="h-[85%] w-[85%] object-contain block" 
        />
      </div>
      {/* Show full name on large screens, short name on medium, icon-only on small */}
      <span className="hidden lg:block text-lg font-black tracking-tighter text-gray-900 drop-shadow-sm group-hover:text-primary transition-colors duration-300">
        {COMPANY_NAME}
      </span>
      <span className="hidden md:block lg:hidden text-sm font-black tracking-tight text-gray-900 drop-shadow-sm group-hover:text-primary transition-colors duration-300">
        {COMPANY_SHORT_NAME}
      </span>
    </Link>
  );
};

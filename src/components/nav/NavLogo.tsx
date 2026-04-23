import { Link } from "react-router-dom";
import { COMPANY_NAME, LOGO_ALT } from "@/config/site";

export const NavLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-1 sm:gap-2 shrink-0">
      <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full overflow-hidden flex items-center justify-center p-0.5">
        <img 
          src="/icon.svg"
          alt={LOGO_ALT}
          className="h-[85%] w-[85%] object-contain block" 
        />
      </div>
      <span className="text-xs sm:text-sm md:text-lg font-black tracking-tight text-gray-900 drop-shadow-sm group-hover:text-primary transition-colors duration-300">
        {COMPANY_NAME}
      </span>
    </Link>
  );
};

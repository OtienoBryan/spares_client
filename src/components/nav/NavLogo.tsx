import { Link } from "react-router-dom";
import { COMPANY_NAME, LOGO_ALT } from "@/config/site";

export const NavLogo = () => {
  return (
    <Link to="/" className="flex items-center gap-0.5 sm:gap-1 shrink-0">
      <img
        src="/logo2.png"
        alt={LOGO_ALT}
        className="block h-20 w-auto sm:h-24 md:h-28 object-contain object-center shrink-0"
      />
      <span className="text-xs sm:text-sm md:text-lg font-black tracking-tight text-gray-900 drop-shadow-sm group-hover:text-primary transition-colors duration-300">
        {COMPANY_NAME}
      </span>
    </Link>
  );
};

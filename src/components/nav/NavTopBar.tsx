import { Phone, CheckCircle, Truck, LifeBuoy } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/config/site";

export const NavTopBar = () => {
  return (
    <div className="bg-white text-black py-1.5 overflow-hidden whitespace-nowrap border-b border-gray-100 hidden sm:block">
      <div className="animate-marquee">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="mx-12 font-black uppercase tracking-[0.1em] text-[10px] flex-shrink-0 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            Delivery within Nairobi is KES 300 and delivery is within 1hr. Contact: 254790 831798
          </span>
        ))}
      </div>
    </div>
  );
};

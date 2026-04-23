import { Phone, CheckCircle, Truck, LifeBuoy } from "lucide-react";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from "@/config/site";

export const NavTopBar = () => {
  return (
    <div className="bg-gray-50 text-gray-600 py-2 text-[10px] sm:text-xs border-b border-gray-100 hidden sm:block">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Genuine Spares Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="h-3 w-3 text-primary" />
              <span>Delivery Across Kenya</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <LifeBuoy className="h-3 w-3 text-blue-500" />
              <span>24/7 Technical Support</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a href={`tel:${CONTACT_PHONE_TEL}`} className="flex items-center gap-1.5 font-bold text-gray-900 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" />
              <span>{CONTACT_PHONE_DISPLAY}</span>
            </a>
            <span className="text-gray-300">|</span>
            <div className="flex items-center gap-1.5">
              <span className="material-icons text-[14px]">chat_bubble_outline</span>
              <span className="font-medium cursor-pointer hover:text-primary">Live Chat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

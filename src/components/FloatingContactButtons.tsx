import { Phone, MessageCircle } from "lucide-react";
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  WHATSAPP_ORDER_NUMBER,
} from "@/config/site";

export default function FloatingContactButtons() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_ORDER_NUMBER}`;

  return (
    <div className="fixed right-4 bottom-20 sm:bottom-6 z-50 flex flex-col gap-3">
      <a
        href={`tel:${CONTACT_PHONE_TEL}`}
        className="h-12 w-12 rounded-full bg-header text-header-foreground shadow-lg hover:shadow-xl hover:bg-header/90 active:scale-95 transition flex items-center justify-center"
        aria-label={`Call ${CONTACT_PHONE_DISPLAY}`}
        title={`Call ${CONTACT_PHONE_DISPLAY}`}
      >
        <Phone className="h-5 w-5" />
      </a>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="h-12 w-12 rounded-full bg-green-600 text-white shadow-lg hover:shadow-xl hover:bg-green-700 active:scale-95 transition flex items-center justify-center"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </div>
  );
}


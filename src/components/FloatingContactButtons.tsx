import { Phone, MessageCircle } from "lucide-react";

const PHONE_DISPLAY = "0790 831798";
const PHONE_TEL = "0790831798";
const WHATSAPP_NUMBER = "254790831798";

export default function FloatingContactButtons() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <div className="fixed right-4 bottom-20 sm:bottom-6 z-50 flex flex-col gap-3">
      <a
        href={`tel:${PHONE_TEL}`}
        className="h-12 w-12 rounded-full bg-wine text-white shadow-lg hover:shadow-xl hover:bg-wine/90 active:scale-95 transition flex items-center justify-center"
        aria-label={`Call ${PHONE_DISPLAY}`}
        title={`Call ${PHONE_DISPLAY}`}
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


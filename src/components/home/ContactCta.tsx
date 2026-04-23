import { Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT_PHONE_DISPLAY } from "@/config/site";

export const ContactCta = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-primary text-white" aria-label="Order Spare Parts">
      <div className="container mx-auto px-3 sm:px-4 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
          Ready to Get Your Parts?
        </h2>
        <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          Order genuine spare parts with fast, reliable delivery across Kenya. We ensure your vehicle gets the precision fit it deserves.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-primary hover:bg-white/90 text-sm sm:text-base h-12 px-6"
            onClick={() => window.location.href = `tel:${CONTACT_PHONE_DISPLAY.replace(/\s+/g, '')}`}
          >
            <Phone className="mr-1 sm:mr-2 h-4 w-4" />
            Call Us: {CONTACT_PHONE_DISPLAY}
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary text-sm sm:text-base h-12 px-6">
            <MapPin className="mr-1 sm:mr-2 h-4 w-4" />
            Our Locations
          </Button>
        </div>
      </div>
    </section>
  );
};

import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroWithFinderProps {
  companyName: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  whatsappNumber: string;
}

export function HeroWithFinder({
  companyName,
  title,
  subtitle,
  imageSrc,
  imageAlt,
  whatsappNumber,
}: HeroWithFinderProps) {
  return (
    <section
      className="relative w-full bg-muted hero-section overflow-hidden"
      aria-label="Hero Banner"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div className="relative w-full min-h-[500px] sm:min-h-[450px] lg:min-h-[550px] flex flex-col">
        {/* Background image — contain so artwork isn’t cropped like object-cover */}
        <div className="absolute inset-0 z-0 flex items-center justify-center bg-muted">
          <picture className="block h-full w-full max-h-full">
            <source media="(max-width: 640px)" srcSet={imageSrc} type="image/png" sizes="100vw" />
            <source
              media="(min-width: 641px) and (max-width: 1024px)"
              srcSet={imageSrc}
              type="image/png"
              sizes="100vw"
            />
            <source media="(min-width: 1025px)" srcSet={imageSrc} type="image/png" sizes="100vw" />
            <img
              src={imageSrc}
              alt={imageAlt}
              className="h-full w-full max-h-full object-contain object-center transition-opacity duration-700"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width="1920"
              height="1080"
              sizes="100vw"
              itemProp="image"
              style={{ opacity: 0 }}
              onLoad={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            />
          </picture>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-header/90 via-header/50 to-header/20" />
        </div>

        {/* Content Layer (Relative to drive height) */}
        <div className="relative z-[2] flex flex-col w-full h-full">
          <div className="flex-1 flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center sm:pt-20 sm:pb-16">
            <p className="text-white/85 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 sm:mb-3 drop-shadow-sm animate-fade-in">
              {companyName}
            </p>
            <h1
              className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-6 drop-shadow-xl leading-tight max-w-4xl"
              itemProp="headline"
            >
              {title}
            </h1>
            <p
              className="text-white/90 text-sm sm:text-base md:text-xl drop-shadow-md max-w-2xl mx-auto font-medium mb-8 sm:mb-10"
              itemProp="description"
            >
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up">
              <Button
                asChild
                className="h-14 px-10 bg-primary hover:bg-primary/90 text-white text-base font-black rounded-xl shadow-xl shadow-primary/40 transition-all hover:-translate-y-1 active:scale-95"
              >
                <Link to="/featured">View Matching Spares</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="h-14 px-8 border-2 border-white/30 bg-white/5 backdrop-blur-md hover:bg-white/15 hover:border-white/50 text-white text-base font-black rounded-xl transition-all hover:-translate-y-1 active:scale-95"
              >
                <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Order via WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

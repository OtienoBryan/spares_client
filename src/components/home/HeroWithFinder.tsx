import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoadingGear } from "@/components/ui/lottie-loader";

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
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <picture>
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
              className="w-full h-full object-cover object-center transition-opacity duration-700"
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
          <div className="absolute inset-0 bg-gradient-to-t from-header/90 via-header/50 to-header/20" />
        </div>

        {/* Content Layer (Relative to drive height) */}
        <div className="relative z-[2] flex flex-col w-full h-full">
          <div className="flex-1 flex flex-col items-center justify-center px-4 pt-10 pb-6 text-center sm:pt-14 sm:pb-8">
            <p className="text-white/85 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 sm:mb-3 drop-shadow-sm animate-fade-in">
              {companyName}
            </p>
            <h1
              className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 drop-shadow-xl leading-tight max-w-3xl"
              itemProp="headline"
            >
              {title}
            </h1>
            <p
              className="text-white/90 text-sm sm:text-base md:text-lg drop-shadow-md max-w-xl mx-auto font-medium"
              itemProp="description"
            >
              {subtitle}
            </p>
          </div>

          <div className="w-full px-3 pb-8 sm:px-6 sm:pb-10 md:pb-12">
            <div
              className="mx-auto max-w-5xl marketplace-card elevation-high p-4 sm:p-6 md:p-8 animate-slide-up bg-white/95 backdrop-blur-sm"
              aria-label="Part finder"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-left">
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-none">
                    Find parts for your vehicle
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground font-medium">
                    Select your vehicle details for a guaranteed fitment.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 self-start sm:self-auto">
                  <LoadingGear size="sm" className="h-4 w-4" />
                  <span className="text-[10px] uppercase tracking-widest font-black text-primary">Precision Verified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:gap-5">
                {[
                  { label: "Year", icon: "calendar_today" },
                  { label: "Make", icon: "minor_crash" },
                  { label: "Model", icon: "category" },
                  { label: "Engine", icon: "settings_input_component" },
                ].map((field) => (
                  <div key={field.label} className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-gray-600">
                      <span className="material-icons text-[14px] text-primary/70">{field.icon}</span>
                      {field.label}
                    </label>
                    <div className="relative group">
                      <select
                        disabled
                        className="h-10 sm:h-12 w-full appearance-none rounded-lg border border-gray-200 bg-gray-50/50 px-3 text-xs sm:text-sm font-bold text-gray-400 cursor-not-allowed transition-all group-hover:border-gray-300"
                        aria-disabled="true"
                      >
                        <option>Select {field.label}</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                        <span className="material-icons text-lg">expand_more</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center pt-5 border-t border-gray-100">
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <Button
                    asChild
                    className="h-12 px-8 bg-primary hover:bg-primary/90 text-white text-sm font-black rounded-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    <Link to="/featured">View Matching Spares</Link>
                  </Button>
                  <Button 
                    asChild 
                    variant="outline" 
                    className="h-12 px-6 border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-800 text-sm font-black rounded-lg transition-all active:scale-95"
                  >
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2">
                      Order via WhatsApp
                    </a>
                  </Button>
                </div>
                <div className="text-center sm:text-right">
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                    Don't see your part? <Link to="/contact" className="text-primary hover:underline font-bold">Ask an Expert</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

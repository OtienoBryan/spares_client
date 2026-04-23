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
      className="relative w-full bg-muted hero-section"
      aria-label="Hero Banner"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div className="w-full max-w-full">
        <div className="relative h-[55vh] sm:h-[52vh] md:h-[62vh] lg:h-[72vh] w-full max-w-full overflow-hidden shadow-2xl hero-image-container">
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
              className="hero-image"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width="1920"
              height="1080"
              sizes="100vw"
              itemProp="image"
              style={{
                width: "100%",
                minWidth: "100%",
                height: "100%",
                minHeight: "100%",
                objectFit: "cover",
                objectPosition: "center center",
                willChange: "auto",
              }}
              onLoad={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            />
          </picture>
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-header/95 via-header/50 to-header/20 pointer-events-none" />
          <div className="absolute inset-0 z-[2] flex flex-col">
            <div className="flex flex-1 flex-col items-center justify-center px-4 pb-2 pt-10 text-center sm:pt-14 pointer-events-none">
              <p className="text-white/85 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2 drop-shadow">
                {companyName}
              </p>
              <h1
                className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 drop-shadow-lg leading-tight max-w-3xl"
                itemProp="headline"
              >
                {title}
              </h1>
              <p
                className="text-white/95 text-sm sm:text-base md:text-lg drop-shadow-md max-w-2xl mx-auto"
                itemProp="description"
              >
                {subtitle}
              </p>
            </div>
            <div className="shrink-0 px-3 pb-8 pt-1 sm:px-4 sm:pb-10 md:pb-12">
              <div
                className="mx-auto max-w-4xl marketplace-card elevation-high p-4 sm:p-6 md:p-8 animate-slide-up"
                aria-label="Part finder"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="text-left">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                      Find parts for your vehicle
                    </h2>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                      Select your vehicle details for a guaranteed fitment.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                    <LoadingGear size="sm" className="h-5 w-5" />
                    <span className="text-[10px] uppercase tracking-widest font-black text-primary">Precision Verified</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                  {[
                    { label: "Year", icon: "calendar_today" },
                    { label: "Make", icon: "minor_crash" },
                    { label: "Model", icon: "category" },
                    { label: "Engine", icon: "settings_input_component" },
                  ].map((field) => (
                    <div key={field.label} className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-gray-500">
                        <span className="material-icons text-[14px]">{field.icon}</span>
                        {field.label}
                      </label>
                      <div className="relative">
                        <select
                          disabled
                          className="h-10 sm:h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-3 text-xs sm:text-sm font-medium text-gray-400 cursor-not-allowed transition-all"
                          aria-disabled="true"
                        >
                          <option>Select {field.label}</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                          <span className="material-icons text-sm">expand_more</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center pt-2">
                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <Button
                      asChild
                      className="h-12 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95"
                    >
                      <Link to="/featured">View Matching Spares</Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      className="h-12 px-6 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl active:scale-95"
                    >
                      <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">
                        Order via WhatsApp
                      </a>
                    </Button>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">
                      Don't see your part? <Link to="/contact" className="text-primary hover:underline font-bold">Ask an Expert</Link>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

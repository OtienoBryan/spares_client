import { Link } from "react-router-dom";

export function SystemDiscovery() {
  // Importing assets is more reliable than referencing `/src/...` at runtime.
  // It also lets Vite fingerprint & optimize these icons for production.
  // (Kept local to this component to avoid impacting other sections.)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const engineIcon = new URL("../../assets/engine.svg", import.meta.url).toString();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const electricalIcon = new URL("../../assets/electrical.svg", import.meta.url).toString();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const brakeIcon = new URL("../../assets/brake.svg", import.meta.url).toString();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const suspensionIcon = new URL("../../assets/suspension.svg", import.meta.url).toString();

  const systems = [
    {
      name: "Engine Systems",
      description: "Blocks, heads, pistons & more",
      iconSrc: engineIcon,
      path: "/category/engine",
      color: "from-blue-500/20 to-blue-600/5",
      accent: "text-blue-600",
    },
    {
      name: "Electrical & Ignition",
      description: "Batteries, starters & plugs",
      iconSrc: electricalIcon,
      path: "/category/electrical",
      color: "from-yellow-500/20 to-yellow-600/5",
      accent: "text-amber-600",
    },
    {
      name: "Braking & Safety",
      description: "Pads, discs & ABS units",
      iconSrc: brakeIcon,
      path: "/category/braking",
      color: "from-red-500/20 to-red-600/5",
      accent: "text-red-600",
    },
    {
      name: "Suspension & Steering",
      description: "Shocks, struts & arms",
      iconSrc: suspensionIcon,
      path: "/category/suspension",
      color: "from-green-500/20 to-green-600/5",
      accent: "text-emerald-600",
    },
  ];

  return (
    <section className="py-6 sm:py-8 bg-white overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-1.5 sm:gap-2">
              <span className="material-icons text-primary text-xl sm:text-2xl">precision_manufacturing</span>
              Explore by Vehicle System
            </h2>
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-xl font-medium">
              Professional-grade components categorized by system for accurate fitment.
            </p>
          </div>
          <Link to="/featured" className="self-start sm:self-auto inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition-all touch-manipulation">
            Browse all
            <span className="material-icons text-xs">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {systems.map((system) => (
            <Link
              key={system.name}
              to={system.path}
              className="group relative marketplace-card p-2.5 sm:p-3.5 md:p-4 overflow-hidden active:scale-[0.97] touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label={`Explore ${system.name}`}
            >
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${system.color} -mr-10 -mt-10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative space-y-2 sm:space-y-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-11 md:w-11 p-1.5 sm:p-2 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-primary transition-all duration-300 shadow-inner">
                  <img 
                    src={system.iconSrc} 
                    alt={system.name} 
                    className="h-full w-full object-contain filter group-hover:invert group-hover:brightness-0" 
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm md:text-base mb-0.5 group-hover:text-primary transition-colors leading-tight">
                    {system.name}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] md:text-xs text-muted-foreground font-medium leading-snug line-clamp-2">
                    {system.description}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-primary text-[11px] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Explore Components
                  <span className="material-icons text-xs">chevron_right</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

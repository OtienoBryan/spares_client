import { Link } from "react-router-dom";

export function SystemDiscovery() {
  const systems = [
    {
      name: "Engine Systems",
      description: "Blocks, heads, pistons & more",
      iconSrc: "/src/assets/engine.svg",
      path: "/category/engine",
      color: "from-blue-500/20 to-blue-600/5",
      accent: "text-blue-600",
    },
    {
      name: "Electrical & Ignition",
      description: "Batteries, starters & plugs",
      iconSrc: "/src/assets/electrical.svg",
      path: "/category/electrical",
      color: "from-yellow-500/20 to-yellow-600/5",
      accent: "text-amber-600",
    },
    {
      name: "Braking & Safety",
      description: "Pads, discs & ABS units",
      iconSrc: "/src/assets/brake.svg",
      path: "/category/braking",
      color: "from-red-500/20 to-red-600/5",
      accent: "text-red-600",
    },
    {
      name: "Suspension & Steering",
      description: "Shocks, struts & arms",
      iconSrc: "/src/assets/suspension.svg",
      path: "/category/suspension",
      color: "from-green-500/20 to-green-600/5",
      accent: "text-emerald-600",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-12">
          <div className="text-left">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              <span className="material-icons text-primary text-3xl">precision_manufacturing</span>
              Explore by Vehicle System
            </h2>
            <p className="mt-2 text-muted-foreground max-w-xl font-medium">
              Professional-grade components categorized by system for accurate fitment and discovery.
            </p>
          </div>
          <Link to="/featured" className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold transition-all">
            Browse all components
            <span className="material-icons text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {systems.map((system) => (
            <Link
              key={system.name}
              to={system.path}
              className="group relative marketplace-card p-6 overflow-hidden hover:-translate-y-1.5"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${system.color} -mr-12 -mt-12 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative space-y-4">
                <div className="h-16 w-16 p-3 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-all duration-300 shadow-inner">
                  <img 
                    src={system.iconSrc} 
                    alt={system.name} 
                    className="h-full w-full object-contain filter group-hover:invert group-hover:brightness-0" 
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1 group-hover:text-primary transition-colors">
                    {system.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                    {system.description}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Explore Components
                  <span className="material-icons text-[14px]">chevron_right</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

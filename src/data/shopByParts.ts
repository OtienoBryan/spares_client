/**
 * Fallback tiles when no categories expose `shopByPartsSort` from the API.
 * Prefer configuring tiles in admin on Category rows (see `categoryShopTiles.ts`).
 */
export interface ShopByPartTile {
  id: string;
  label: string;
  /** Prefills home search when the tile is clicked */
  searchQuery: string;
}

export const SHOP_BY_PARTS_FALLBACK_TILES: ShopByPartTile[] = [
  { id: "spark-plug", label: "Spark plug", searchQuery: "spark plug" },
  { id: "air-filter", label: "Air filter", searchQuery: "air filter" },
  { id: "oil-filter", label: "Oil filter", searchQuery: "oil filter" },
  { id: "fuel-filter", label: "Fuel filter", searchQuery: "fuel filter" },
  { id: "cabin-filter", label: "Cabin filter", searchQuery: "cabin filter" },
  { id: "oils", label: "Oils", searchQuery: "engine oil" },
  { id: "brake-pad", label: "Brake pad", searchQuery: "brake pad" },
  { id: "brake-disc", label: "Brake disc", searchQuery: "brake disc" },
  { id: "shock-absorber", label: "Shock absorber", searchQuery: "shock absorber" },
  { id: "coil-spring", label: "Coil spring", searchQuery: "coil spring" },
  { id: "wiper", label: "Wiper", searchQuery: "wiper" },
  { id: "battery", label: "Battery", searchQuery: "battery" },
];

export function shopByPartImageSrc(id: string): string {
  return `/parts/${id}.jpg`;
}

/** @deprecated Use SHOP_BY_PARTS_FALLBACK_TILES */
export const SHOP_BY_PARTS_TILES = SHOP_BY_PARTS_FALLBACK_TILES;

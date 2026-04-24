import { useMemo } from "react";
import { useCategories } from "@/hooks/useApi";

export interface NavigationCategory {
  name: string;
  path: string;
  icon?: string;
  id?: string | number;
}

export function useNavigationCategories() {
  const { data: apiCategories = [], loading, error } = useCategories();

  // Helper function to get appropriate icon for category
  function getCategoryIcon(categoryName: string): string {
    const name = categoryName.toLowerCase();
    if (name.includes('engine')) return "⚙️";
    if (name.includes('suspension')) return "🔧";
    if (name.includes('brake') || name.includes('braking')) return "🛑";
    if (name.includes('electric') || name.includes('battery')) return "⚡";
    if (name.includes('filter')) return "🌪️";
    if (name.includes('lighting')) return "💡";
    return "📦"; 
  }

  const categories = useMemo(() => {
    const baseCategories: NavigationCategory[] = [
      { name: "Engine", path: "/category/engine", icon: "⚙️" },
      { name: "Suspension", path: "/category/suspension", icon: "🔧" },
      { name: "Braking", path: "/category/braking", icon: "🛑" },
      { name: "Electrical", path: "/category/electrical", icon: "⚡" }
    ];

    const apiCategoriesList = apiCategories
      ?.filter(cat => {
        const name = cat.name.toLowerCase();
        return !['engine', 'suspension', 'home', 'braking', 'brake', 'electrical', 'electric'].includes(name);
      })
      .map(category => ({
        name: category.name,
        path: `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`,
        icon: getCategoryIcon(category.name),
        id: category.id
      })) || [];

    return [...baseCategories, ...apiCategoriesList];
  }, [apiCategories]);

  return {
    categories,
    loading,
    error
  };
}

import { useMemo } from "react";
import { useCategories, useSubCategories } from "@/hooks/useApi";
import { Category, SubCategory } from "@/services/api";
import { 
  Settings, 
  ArrowDownUp, 
  Disc, 
  Zap, 
  Filter, 
  Lightbulb, 
  Box,
  LucideIcon 
} from "lucide-react";

export interface NavigationCategory {
  name: string;
  path: string;
  icon?: LucideIcon;
  id?: string | number;
  subcategories?: Array<{ name: string; path: string }>;
}

export function useNavigationCategories() {
  const { data: apiCategories = [], loading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: allSubCategories = [], loading: subCategoriesLoading } = useSubCategories();

  // Helper function to get appropriate icon for category
  function getCategoryIcon(categoryName: string): LucideIcon {
    const name = categoryName.toLowerCase();
    if (name.includes('engine')) return Settings;
    if (name.includes('suspension')) return ArrowDownUp;
    if (name.includes('brake') || name.includes('braking')) return Disc;
    if (name.includes('electric') || name.includes('battery')) return Zap;
    if (name.includes('filter')) return Filter;
    if (name.includes('lighting')) return Lightbulb;
    return Box; 
  }

  const categories = useMemo(() => {
    const apiCats = (apiCategories || []) as Category[];
    const subCats = (allSubCategories || []) as SubCategory[];

    // Showing all categories as requested (transitioning backend to cars data)
    const automotiveCategories = apiCats.filter(cat => cat.name.toLowerCase() !== 'home');

    return automotiveCategories.map(category => {
      const catId = category.id;
      const path = `/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`;
      
      const subcategories = subCats
        ?.filter(sub => sub.categoryId === catId && sub.isActive)
        .map(sub => ({
          name: sub.name,
          path: `${path}?subcategory=${sub.id}`
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        name: category.name,
        path: path,
        icon: getCategoryIcon(category.name),
        id: catId,
        subcategories: subcategories && subcategories.length > 0 ? subcategories : undefined
      };
    });
  }, [apiCategories, allSubCategories]);

  return {
    categories,
    loading: categoriesLoading || subCategoriesLoading,
    error: categoriesError
  };
}

import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { CategoriesSidebarPermanent } from "./ui/categories-sidebar-permanent";
import { useNavigationCategories } from "@/hooks/useNavigationCategories";

interface GlobalLayoutProps {
  children: ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const { categories, loading } = useNavigationCategories();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <div className="flex flex-1 relative">
        <CategoriesSidebarPermanent 
          categories={categories} 
          isLoading={loading} 
        />
        <main className="flex-1 w-full lg:ml-64 transition-all duration-300">
          {children || <Outlet />}
        </main>
      </div>
      <div className="lg:ml-64 transition-all duration-300">
        <Footer />
      </div>
    </div>
  );
}

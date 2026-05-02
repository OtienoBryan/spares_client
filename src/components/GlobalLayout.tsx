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
    <div className="min-h-screen flex flex-col bg-gray-50 overflow-x-clip">
      <Navigation />
      <div className="flex flex-1 relative overflow-x-hidden">
        <CategoriesSidebarPermanent 
          categories={categories} 
          isLoading={loading} 
        />
        <main className="flex-1 w-full min-w-0 lg:ml-64 transition-all duration-300 overflow-x-hidden">
          {children || <Outlet />}
        </main>
      </div>
      <div className="lg:ml-64 transition-all duration-300 overflow-x-hidden">
        <Footer />
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Home } from "lucide-react";

interface CategoryHeaderProps {
  categoryDisplayName: string;
}

export const CategoryHeader = ({ categoryDisplayName }: CategoryHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8">
      <nav className="flex mb-4 sm:mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-1 md:space-x-2 text-xs sm:text-sm">
          <li className="flex items-center">
            <Link to="/" className="text-muted-foreground hover:text-primary flex items-center transition-colors">
              <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Home
            </Link>
          </li>
          <li className="flex items-center text-muted-foreground">
            <span className="mx-1 md:mx-2">/</span>
            <span className="font-medium text-primary">{categoryDisplayName}</span>
          </li>
        </ol>
      </nav>
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
            {categoryDisplayName}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Explore our wide range of quality spare parts and components.
          </p>
        </div>
      </div>
    </div>
  );
};

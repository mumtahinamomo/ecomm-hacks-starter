import { ChevronRight } from "lucide-react";

export const Breadcrumb = () => {
  return (
    <nav className="flex items-center gap-2 text-xs text-muted-foreground py-4">
      <a href="#" className="hover:text-foreground transition-colors">
        Home
      </a>
      <ChevronRight className="w-3 h-3" />
      <a href="#" className="hover:text-foreground transition-colors">
        Women
      </a>
      <ChevronRight className="w-3 h-3" />
      <span className="text-foreground">Bottoms</span>
    </nav>
  );
};

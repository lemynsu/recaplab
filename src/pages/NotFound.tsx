import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="text-center">
        <p className="text-6xl font-display text-foreground mb-4">404</p>
        <p className="text-sm text-muted-foreground mb-6">This page doesn't exist.</p>
        <Link to="/" className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

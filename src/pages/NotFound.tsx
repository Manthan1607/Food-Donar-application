import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Helmet>
        <title>Page not found — FoodDonar</title>
        <meta name="description" content="The page you're looking for doesn't exist on FoodDonar. Head back home to keep sharing food." />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404 — Page not found</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! That page doesn't exist.</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

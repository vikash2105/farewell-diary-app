export default function NotFound() {
  return (
    <div className="site-shell flex items-center justify-center">
      <div className="text-center">
        <h1 className="brand-script mb-4 text-7xl font-bold text-primary">404</h1>
        <p className="mb-8 text-xl text-muted-foreground">Page not found</p>
        <a href="/" className="btn btn-primary">Go Home</a>
      </div>
    </div>
  );
}

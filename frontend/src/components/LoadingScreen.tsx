export default function LoadingScreen() {
  return (
    <div className="site-shell flex items-center justify-center">
      <div className="animate-pulse text-primary">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    </div>
  );
}

import Skeleton from "react-loading-skeleton";

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-background-base p-5 flex flex-col gap-4" aria-busy="true" aria-label="Loading page">
      <div className="h-14 bg-background-surface rounded-lg w-full mb-4 animate-pulse" />
      <Skeleton height={120} borderRadius={8} />
      <Skeleton height={80} borderRadius={8} />
      <Skeleton height={160} borderRadius={8} />
    </div>
  );
}

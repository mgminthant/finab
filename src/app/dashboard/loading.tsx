export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="h-24 rounded-lg bg-card animate-pulse" />
      <div className="h-24 rounded-lg bg-card animate-pulse" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-48 rounded-lg bg-card animate-pulse" />
        <div className="h-48 rounded-lg bg-card animate-pulse" />
      </div>
      <div className="h-32 rounded-lg bg-card animate-pulse" />
    </div>
  );
}

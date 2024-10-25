import { Skeleton } from "./ui/skeleton";

export default function BotsLoading({ count = 6 }: { count?: number }) {
  return Array.from({ length: count }).map((_, i) => (
    <div key={i} className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ));
}

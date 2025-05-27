import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <div className="flex items-center h-9 rounded-md gap-1.5 px-2.5 bg-gray-300">
      <Skeleton className="bg-gray-200 h-4 w-[90px]" />
      <Skeleton className="bg-gray-200 h-7 w-7 rounded-full" />
    </div>
  );
}

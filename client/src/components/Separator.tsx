import { cn } from "@/lib/utils";

export default function Separator({ className }: { className?: string }) {
  return (
    <hr
      className={cn(
        "my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400",
        className
      )}
    />
  );
}

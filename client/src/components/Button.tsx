import { cn } from "../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        className,
        "inline-block bg-blue-600 text-white rounded-full px-4 py-2 transition hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-400 cursor-pointer"
      )}
      {...props}
    >
      {children}
    </button>
  );
}

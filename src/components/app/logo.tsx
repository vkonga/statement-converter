import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
    >
      <rect width="32" height="32" rx="8" fill="hsl(var(--primary))" />
      <path
        d="M10 10H14.5C15.8807 10 17 11.1193 17 12.5V12.5C17 13.8807 15.8807 15 14.5 15H10V10Z"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
      />
      <path
        d="M10 15L10 22"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 22V15H17.5C16.1193 15 15 16.1193 15 17.5V17.5C15 18.8807 16.1193 20 17.5 20H22"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
      />
      <path
        d="M22 15L22 10"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

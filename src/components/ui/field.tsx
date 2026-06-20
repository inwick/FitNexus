import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-foreground transition-all placeholder:text-slate-400 hover:border-brand/20 focus-visible:border-brand/40 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/10";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-medium text-foreground/80", className)}
      {...props}
    />
  );
}

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(fieldBase, className)} {...props} />;
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(fieldBase, "min-h-28 resize-y", className)}
      {...props}
    />
  );
});

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(fieldBase, "cursor-pointer bg-white", className)}
      {...props}
    />
  );
});

export function FormRow({
  label,
  children,
  htmlFor,
}: {
  label: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

export function Alert({
  variant = "error",
  children,
}: {
  variant?: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "rounded-xl px-4 py-2.5 text-sm",
        variant === "error"
          ? "border border-red-100 bg-red-50 text-red-700"
          : "border border-emerald-100 bg-emerald-50 text-emerald-700"
      )}
    >
      {children}
    </p>
  );
}

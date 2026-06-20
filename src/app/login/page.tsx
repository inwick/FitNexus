"use client";

import { useActionState } from "react";
import Link from "next/link";
import { authenticate, type ActionState } from "@/server/auth-actions";
import { Button } from "@/components/ui/button";
import { FormRow, Input, Alert } from "@/components/ui/field";
import { AuthShell } from "@/components/auth-shell";

const initial: ActionState = {};

const demoAccounts = [
  { role: "Member", email: "member@fitnexus.com" },
  { role: "Coach", email: "coach@fitnexus.com" },
  { role: "Admin", email: "admin@fitnexus.com" },
];

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(authenticate, initial);

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue to FitNexus.">
      <form action={formAction} className="space-y-5">
        <FormRow label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        </FormRow>
        <FormRow label="Password" htmlFor="password">
          <Input id="password" name="password" type="password" placeholder="••••••••" required />
        </FormRow>

        {state.error ? <Alert variant="error">{state.error}</Alert> : null}

        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? "Logging in..." : "Log in"}
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-border bg-black/[0.02] p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Demo accounts
        </p>
        <p className="mt-1 text-xs text-muted">
          Password: <span className="font-mono font-medium text-foreground">password123</span>
        </p>
        <div className="mt-3 space-y-1.5">
          {demoAccounts.map((a) => (
            <div key={a.email} className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{a.role}</span>
              <span className="font-mono text-muted">{a.email}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-brand hover:text-brand-dark">
          Sign up free
        </Link>
      </p>
    </AuthShell>
  );
}

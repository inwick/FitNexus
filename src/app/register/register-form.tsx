"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  registerCoach,
  registerMember,
  type ActionState,
} from "@/server/auth-actions";
import { Button } from "@/components/ui/button";
import { FormRow, Input, Select, Alert } from "@/components/ui/field";
import { AuthShell } from "@/components/auth-shell";
import { cn } from "@/lib/utils";
import { genderLabels, genders, goalLabels, goals } from "@/lib/validations";

const initial: ActionState = {};

function FieldError({ name, state }: { name: string; state: ActionState }) {
  const msg = state.fieldErrors?.[name]?.[0];
  if (!msg) return null;
  return <p className="text-xs text-red-600">{msg}</p>;
}

export function RegisterForm({
  initialRole,
}: {
  initialRole: "member" | "coach";
}) {
  const [role, setRole] = useState<"member" | "coach">(initialRole);
  const action = role === "member" ? registerMember : registerCoach;
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join FitNexus in under a minute."
    >
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl bg-black/[0.03] p-1">
        {(["member", "coach"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={cn(
              "rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
              role === r
                ? "bg-white text-foreground shadow-sm ring-1 ring-border"
                : "text-muted hover:text-foreground"
            )}
          >
            {r === "member" ? "I'm a member" : "I'm a coach"}
          </button>
        ))}
      </div>

      <form action={formAction} className="space-y-4">
        <FormRow label="Full name" htmlFor="name">
          <Input id="name" name="name" placeholder="Jane Doe" required />
          <FieldError name="name" state={state} />
        </FormRow>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormRow label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            <FieldError name="email" state={state} />
          </FormRow>
          <FormRow label="Mobile" htmlFor="mobile">
            <Input id="mobile" name="mobile" placeholder="+1 555 123 4567" required />
            <FieldError name="mobile" state={state} />
          </FormRow>
        </div>

        <FormRow label="Password" htmlFor="password">
          <Input id="password" name="password" type="password" placeholder="Min. 6 characters" required />
          <FieldError name="password" state={state} />
        </FormRow>

        {role === "member" && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <FormRow label="Height (cm)" htmlFor="height">
                <Input id="height" name="height" type="number" step="0.1" required />
                <FieldError name="height" state={state} />
              </FormRow>
              <FormRow label="Weight (kg)" htmlFor="weight">
                <Input id="weight" name="weight" type="number" step="0.1" required />
                <FieldError name="weight" state={state} />
              </FormRow>
              <FormRow label="Age" htmlFor="age">
                <Input id="age" name="age" type="number" required />
                <FieldError name="age" state={state} />
              </FormRow>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormRow label="Gender" htmlFor="gender">
                <Select id="gender" name="gender" defaultValue="MALE">
                  {genders.map((g) => (
                    <option key={g} value={g}>{genderLabels[g]}</option>
                  ))}
                </Select>
              </FormRow>
              <FormRow label="Goal" htmlFor="goal">
                <Select id="goal" name="goal" defaultValue="GENERAL_FITNESS">
                  {goals.map((g) => (
                    <option key={g} value={g}>{goalLabels[g]}</option>
                  ))}
                </Select>
              </FormRow>
            </div>
          </>
        )}

        {state.error ? <Alert variant="error">{state.error}</Alert> : null}

        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-dark">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}

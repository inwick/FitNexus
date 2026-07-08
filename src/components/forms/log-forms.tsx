"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  logProgress,
  logWorkout,
  type ActionResult,
} from "@/server/member-actions";
import { Button } from "@/components/ui/button";
import { FormRow, Input } from "@/components/ui/field";

const initial: ActionResult = {};

function Message({ state }: { state: ActionResult }) {
  if (state.error)
    return <p className="text-sm text-red-600">{state.error}</p>;
  if (state.success)
    return <p className="text-sm text-green-700 dark:text-green-400">{state.success}</p>;
  return null;
}

export function WorkoutLogForm() {
  const [state, formAction, pending] = useActionState(logWorkout, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="space-y-4">
      <FormRow label="Exercise" htmlFor="exercise">
        <Input id="exercise" name="exercise" placeholder="Bench press" required />
      </FormRow>
      <div className="grid grid-cols-3 gap-3">
        <FormRow label="Sets" htmlFor="sets">
          <Input id="sets" name="sets" type="number" min="1" required />
        </FormRow>
        <FormRow label="Reps" htmlFor="reps">
          <Input id="reps" name="reps" type="number" min="1" required />
        </FormRow>
        <FormRow label="Weight (kg)" htmlFor="weight">
          <Input id="weight" name="weight" type="number" step="0.5" min="0" />
        </FormRow>
      </div>
      <Message state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Log workout"}
      </Button>
    </form>
  );
}

export function ProgressLogForm() {
  const [state, formAction, pending] = useActionState(logProgress, initial);
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormRow label="Weight (kg)" htmlFor="pweight">
          <Input id="pweight" name="weight" type="number" step="0.1" min="0" required />
        </FormRow>
        <FormRow label="Body fat (%)" htmlFor="bodyFat">
          <Input id="bodyFat" name="bodyFat" type="number" step="0.1" min="0" />
        </FormRow>
      </div>
      <Message state={state} />
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save progress"}
      </Button>
    </form>
  );
}

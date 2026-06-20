"use client";

import { useActionState } from "react";
import { updateCoachProfile, type ActionResult } from "@/server/coach-actions";
import { Button } from "@/components/ui/button";
import { FormRow, Input, Textarea } from "@/components/ui/field";

const initial: ActionResult = {};

export function CoachProfileForm({
  defaults,
}: {
  defaults: {
    bio: string;
    experience: string;
    certifications: string;
    specialties: string;
  };
}) {
  const [state, formAction, pending] = useActionState(
    updateCoachProfile,
    initial
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormRow label="Bio" htmlFor="bio">
        <Textarea
          id="bio"
          name="bio"
          defaultValue={defaults.bio}
          placeholder="Tell members about your coaching style and approach."
        />
      </FormRow>
      <FormRow label="Experience" htmlFor="experience">
        <Input
          id="experience"
          name="experience"
          defaultValue={defaults.experience}
          placeholder="e.g. 5 years as a strength coach"
        />
      </FormRow>
      <FormRow label="Certifications" htmlFor="certifications">
        <Input
          id="certifications"
          name="certifications"
          defaultValue={defaults.certifications}
          placeholder="Comma separated, e.g. NASM CPT, CSCS"
        />
      </FormRow>
      <FormRow label="Specialties" htmlFor="specialties">
        <Input
          id="specialties"
          name="specialties"
          defaultValue={defaults.specialties}
          placeholder="Comma separated, e.g. Fat loss, Strength, Mobility"
        />
      </FormRow>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
          {state.success}
        </p>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}

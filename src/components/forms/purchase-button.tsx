"use client";

import { useActionState } from "react";
import { purchasePackage, type ActionResult } from "@/server/member-actions";
import { Button } from "@/components/ui/button";

const initial: ActionResult = {};

export function PurchaseButton({
  packageId,
  alreadyOwned,
}: {
  packageId: string;
  alreadyOwned?: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    purchasePackage,
    initial
  );

  if (alreadyOwned) {
    return (
      <span className="text-sm font-medium text-green-700 dark:text-green-400">Purchased</span>
    );
  }

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="packageId" value={packageId} />
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Processing..." : "Purchase"}
      </Button>
      {state.error ? (
        <p className="text-xs text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-xs text-green-700 dark:text-green-400">{state.success}</p>
      ) : null}
    </form>
  );
}

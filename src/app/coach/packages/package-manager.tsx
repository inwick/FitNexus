"use client";

import { useActionState } from "react";
import {
  activateSubscription,
  createPackage,
  togglePackage,
  type ActionResult,
} from "@/server/coach-actions";
import { Button } from "@/components/ui/button";
import { Badge, Card, CardTitle, EmptyState } from "@/components/ui/card";
import { FormRow, Input, Textarea } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";

const initial: ActionResult = {};

type PackageRow = {
  id: string;
  title: string;
  description: string;
  price: number;
  durationDays: number;
  active: boolean;
};

function SubscriptionGate({ price }: { price: number }) {
  const [state, formAction, pending] = useActionState(
    activateSubscription,
    initial
  );
  return (
    <Card className="max-w-xl">
      <CardTitle className="mb-1">Subscribe to publish packages</CardTitle>
      <p className="text-sm text-muted">
        FitNexus charges coaches a monthly subscription of{" "}
        <span className="font-semibold text-foreground">
          {formatCurrency(price)}/month
        </span>{" "}
        to list packages on the marketplace. Activate your subscription to
        start creating packages.
      </p>
      <ul className="mt-4 space-y-1 text-sm text-muted">
        <li>- Unlimited packages</li>
        <li>- Client management tools</li>
        <li>- Workout & meal plan builder</li>
      </ul>
      <form action={formAction} className="mt-4">
        {state.error ? (
          <p className="mb-2 text-sm text-red-600">{state.error}</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending
            ? "Activating..."
            : `Subscribe for ${formatCurrency(price)}/month`}
        </Button>
        <p className="mt-2 text-xs text-muted">
          Payment is recorded manually for now.
        </p>
      </form>
    </Card>
  );
}

function CreatePackageForm() {
  const [state, formAction, pending] = useActionState(createPackage, initial);
  return (
    <Card>
      <CardTitle className="mb-4">Create a package</CardTitle>
      <form action={formAction} className="space-y-4">
        <FormRow label="Title" htmlFor="title">
          <Input id="title" name="title" placeholder="12-Week Transformation" required />
        </FormRow>
        <FormRow label="Description" htmlFor="description">
          <Textarea
            id="description"
            name="description"
            placeholder="What's included in this package?"
            required
          />
        </FormRow>
        <div className="grid grid-cols-2 gap-3">
          <FormRow label="Price (USD)" htmlFor="price">
            <Input id="price" name="price" type="number" min="1" step="1" required />
          </FormRow>
          <FormRow label="Duration (days)" htmlFor="durationDays">
            <Input
              id="durationDays"
              name="durationDays"
              type="number"
              min="1"
              required
            />
          </FormRow>
        </div>
        {state.error ? (
          <p className="text-sm text-red-600">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="text-sm text-green-700 dark:text-green-400">{state.success}</p>
        ) : null}
        <Button type="submit" disabled={pending}>
          {pending ? "Creating..." : "Create package"}
        </Button>
      </form>
    </Card>
  );
}

export function PackageManager({
  subscriptionActive,
  monthlyPrice,
  packages,
}: {
  subscriptionActive: boolean;
  monthlyPrice: number;
  packages: PackageRow[];
}) {
  if (!subscriptionActive) {
    return <SubscriptionGate price={monthlyPrice} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <CreatePackageForm />
      <div>
        <CardTitle className="mb-3">Your packages</CardTitle>
        {packages.length === 0 ? (
          <EmptyState
            title="No packages yet"
            description="Create your first package to appear in the marketplace."
          />
        ) : (
          <div className="space-y-3">
            {packages.map((pkg) => (
              <Card key={pkg.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{pkg.title}</p>
                      <Badge color={pkg.active ? "green" : "slate"}>
                        {pkg.active ? "Active" : "Hidden"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted">
                      {formatCurrency(pkg.price)} - {pkg.durationDays} days
                    </p>
                  </div>
                  <form action={togglePackage}>
                    <input type="hidden" name="id" value={pkg.id} />
                    <Button type="submit" variant="outline" size="sm">
                      {pkg.active ? "Hide" : "Show"}
                    </Button>
                  </form>
                </div>
                <p className="mt-2 text-sm text-muted">{pkg.description}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

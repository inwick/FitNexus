import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { Badge, Card, CardTitle } from "@/components/ui/card";
import { PurchaseButton } from "@/components/forms/purchase-button";
import { formatCurrency } from "@/lib/utils";

export default async function CoachDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireRole("MEMBER");
  const { id } = await params;

  const coach = await prisma.coachProfile.findUnique({
    where: { id },
    include: {
      user: true,
      packages: { where: { active: true }, orderBy: { price: "asc" } },
    },
  });
  if (!coach) notFound();

  const myPurchases = await prisma.purchase.findMany({
    where: { memberId: user.id, coachId: coach.id },
  });
  const ownedPackageIds = new Set(myPurchases.map((p) => p.packageId));

  const list = (value: string) =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  return (
    <div>
      <PageHeader title={coach.user?.name ?? "Coach"} description={coach.experience} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle className="mb-2">About</CardTitle>
          <p className="text-sm text-muted">{coach.bio || "No bio yet."}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Certifications
              </p>
              <ul className="mt-1 space-y-1 text-sm">
                {list(coach.certifications).map((c) => (
                  <li key={c}>- {c}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-muted">
                Specialties
              </p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {list(coach.specialties).map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <CardTitle>Packages</CardTitle>
          {(coach.packages ?? []).map((pkg) => (
            <Card key={pkg.id}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">{pkg.title}</p>
                  <p className="text-xs text-muted">{pkg.durationDays} days</p>
                </div>
                <span className="font-display font-bold text-brand-dark dark:text-brand">
                  {formatCurrency(pkg.price)}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{pkg.description}</p>
              <div className="mt-3">
                <PurchaseButton
                  packageId={pkg.id}
                  alreadyOwned={ownedPackageIds.has(pkg.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

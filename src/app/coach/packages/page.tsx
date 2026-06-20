import { prisma } from "@/lib/prisma";
import { requireRole, getCoachProfile } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { COACH_MONTHLY_PRICE } from "@/lib/constants";
import { PackageManager } from "./package-manager";

export default async function CoachPackagesPage() {
  const user = await requireRole("COACH");
  const profile = await getCoachProfile(user.id);

  const packages = profile
    ? await prisma.package.findMany({
        where: { coachId: profile.id },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <PageHeader
        title="Packages"
        description="Create and manage the packages members can purchase."
      />
      <PackageManager
        subscriptionActive={profile?.subscriptionStatus === "ACTIVE"}
        monthlyPrice={COACH_MONTHLY_PRICE}
        packages={packages.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          price: p.price,
          durationDays: p.durationDays,
          active: p.active,
        }))}
      />
    </div>
  );
}

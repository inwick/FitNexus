import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { Badge, Card, EmptyState } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export default async function BrowseCoachesPage() {
  await requireRole("MEMBER");
  const coaches = await prisma.coachProfile.findMany({
    where: {
      packages: { some: { active: true } },
      user: { active: true },
    },
    include: {
      user: true,
      packages: { where: { active: true }, orderBy: { price: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Find a coach"
        description="Browse coaches and hire the one that fits your goals."
      />

      {coaches.length === 0 ? (
        <EmptyState
          title="No coaches available yet"
          description="Check back soon - new coaches are joining FitNexus."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {coaches.map((coach) => {
            const specialties = coach.specialties
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .slice(0, 3);
            const pkgs = coach.packages ?? [];
            const lowest = pkgs[0]?.price;
            return (
              <Card key={coach.id} hover className="flex flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold">
                      {coach.user?.name ?? "Coach"}
                    </h3>
                    <p className="text-xs text-muted">{coach.experience}</p>
                  </div>
                  {lowest != null ? (
                    <Badge color="indigo">From {formatCurrency(lowest)}</Badge>
                  ) : null}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {coach.bio || "No bio yet."}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {specialties.map((s) => (
                    <Badge key={s}>{s}</Badge>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-muted">
                    {pkgs.length} package
                    {pkgs.length === 1 ? "" : "s"}
                  </span>
                  <ButtonLink href={`/member/coaches/${coach.id}`} size="sm">
                    View profile
                  </ButtonLink>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { requireRole, getCoachProfile } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import {
  Badge,
  Card,
  CardTitle,
  EmptyState,
  StatCard,
} from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function CoachDashboard() {
  const user = await requireRole("COACH");
  const profile = await getCoachProfile(user.id);

  if (!profile) {
    return (
      <div>
        <PageHeader title="Dashboard" />
        <EmptyState
          title="Finish setting up"
          description="Complete your coach profile to get started."
          action={<ButtonLink href="/coach/profile">Edit profile</ButtonLink>}
        />
      </div>
    );
  }

  const [paidPurchases, packageCount, recent] = await Promise.all([
    prisma.purchase.findMany({
      where: { coachId: profile.id, status: "PAID" },
    }),
    prisma.package.count({ where: { coachId: profile.id } }),
    prisma.purchase.findMany({
      where: { coachId: profile.id },
      include: { member: true, package: true },
      orderBy: { purchasedAt: "desc" },
      take: 5,
    }),
  ]);

  const revenue = paidPurchases.reduce((sum, p) => sum + p.amount, 0);
  const clientIds = new Set(paidPurchases.map((p) => p.memberId));

  return (
    <div>
      <PageHeader
        title={`Welcome, ${user.name?.split(" ")[0] ?? "Coach"}`}
        description="Your coaching business at a glance."
        action={
          <Badge color={profile.subscriptionStatus === "ACTIVE" ? "green" : "yellow"}>
            {profile.subscriptionStatus === "ACTIVE"
              ? `Active until ${profile.subscriptionExpiry ? formatDate(profile.subscriptionExpiry) : ""}`
              : "Subscription inactive"}
          </Badge>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Active clients"
          value={clientIds.size}
          tier="volt"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          }
        />
        <StatCard
          label="Packages"
          value={packageCount}
          tier="violet"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          }
        />
        <StatCard
          label="Revenue (paid)"
          value={formatCurrency(revenue)}
          tier="flare"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <Card className="mt-6">
        <CardTitle className="mb-3">Recent purchases</CardTitle>
        {recent.length === 0 ? (
          <EmptyState
            title="No purchases yet"
            description="When members buy your packages, they'll show up here."
          />
        ) : (
          <ul className="divide-y divide-border">
            {recent.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="font-medium">{p.member?.name ?? "Member"}</span>
                <span className="text-muted">{p.package?.title ?? "Package"}</span>
                <Badge color={p.status === "PAID" ? "green" : "yellow"}>
                  {p.status}
                </Badge>
                <span className="text-xs text-muted">
                  {formatDate(p.purchasedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

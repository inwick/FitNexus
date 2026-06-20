import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { Card, CardTitle, EmptyState } from "@/components/ui/card";
import { ProgressLogForm } from "@/components/forms/log-forms";
import { LineChart, type ChartPoint } from "@/components/ui/line-chart";
import { formatDate } from "@/lib/utils";

export default async function ProgressPage() {
  const user = await requireRole("MEMBER");
  const entries = await prisma.progressEntry.findMany({
    where: { memberId: user.id },
    orderBy: { date: "asc" },
    take: 60,
  });

  const weightChart: ChartPoint[] = entries.map((e) => ({
    label: formatDate(e.date).replace(/,.*/, ""),
    value: e.weight,
  }));

  return (
    <div>
      <PageHeader
        title="Progress"
        description="Track your body weight and body fat over time."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle className="mb-4">Add an entry</CardTitle>
          <ProgressLogForm />
        </Card>

        <div className="space-y-6">
          <Card>
            <CardTitle className="mb-3">Weight trend</CardTitle>
            <LineChart data={weightChart} unit="kg" />
          </Card>

          <Card>
            <CardTitle className="mb-3">Entries</CardTitle>
            {entries.length === 0 ? (
              <EmptyState
                title="No entries yet"
                description="Add your first measurement to see your trend."
              />
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-muted">
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Weight</th>
                    <th className="pb-2">Body fat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[...entries].reverse().map((e) => (
                    <tr key={e.id}>
                      <td className="py-2 text-muted">{formatDate(e.date)}</td>
                      <td className="py-2 font-medium">{e.weight}kg</td>
                      <td className="py-2">
                        {e.bodyFat != null ? `${e.bodyFat}%` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

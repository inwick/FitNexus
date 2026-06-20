import { requireRole, getCoachProfile } from "@/lib/session";
import { PageHeader } from "@/components/dashboard-shell";
import { Badge, Card, CardTitle } from "@/components/ui/card";
import { CoachProfileForm } from "./profile-form";

export default async function CoachProfilePage() {
  const user = await requireRole("COACH");
  const profile = await getCoachProfile(user.id);

  return (
    <div>
      <PageHeader
        title="Your profile"
        description="This is what members see when they browse coaches."
        action={
          <Badge color={profile?.subscriptionStatus === "ACTIVE" ? "green" : "slate"}>
            {profile?.subscriptionStatus === "ACTIVE"
              ? "Subscription active"
              : "No subscription"}
          </Badge>
        }
      />

      <Card className="max-w-2xl">
        <CardTitle className="mb-4">Coach details</CardTitle>
        <CoachProfileForm
          defaults={{
            bio: profile?.bio ?? "",
            experience: profile?.experience ?? "",
            certifications: profile?.certifications ?? "",
            specialties: profile?.specialties ?? "",
          }}
        />
      </Card>
    </div>
  );
}

import { RegisterForm } from "./register-form";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const initialRole = role === "coach" ? "coach" : "member";

  return <RegisterForm initialRole={initialRole} />;
}

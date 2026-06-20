import { signOut } from "@/auth";
import { buttonClasses } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <button className={buttonClasses("outline", "sm")} type="submit">
        Sign out
      </button>
    </form>
  );
}

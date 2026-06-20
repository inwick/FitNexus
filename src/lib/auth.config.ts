import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/lib/db-types";

const roleHome: Record<Role, string> = {
  MEMBER: "/member/dashboard",
  COACH: "/coach/dashboard",
  ADMIN: "/admin/dashboard",
};

export function homeForRole(role: Role) {
  return roleHome[role];
}

// Edge-safe config (no Prisma / bcrypt here) shared with middleware.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const role = auth?.user?.role;
      const isLoggedIn = !!role;
      const { pathname } = nextUrl;

      const areaRoles: { prefix: string; role: Role }[] = [
        { prefix: "/member", role: "MEMBER" },
        { prefix: "/coach", role: "COACH" },
        { prefix: "/admin", role: "ADMIN" },
      ];

      const protectedArea = areaRoles.find((a) =>
        pathname.startsWith(a.prefix)
      );

      if (protectedArea) {
        if (!isLoggedIn) return false; // redirect to signIn
        if (role !== protectedArea.role) {
          return Response.redirect(new URL(roleHome[role], nextUrl));
        }
        return true;
      }

      // Keep logged-in users away from auth pages.
      if (
        isLoggedIn &&
        (pathname === "/login" || pathname === "/register")
      ) {
        return Response.redirect(new URL(roleHome[role], nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { homeForRole } from "@/lib/auth.config";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const features = [
  {
    title: "For Members",
    desc: "Find your perfect coach and track every rep.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
      </svg>
    ),
    points: ["Set goals & build your profile", "Browse & hire expert coaches", "Log workouts & track progress"],
  },
  {
    title: "For Coaches",
    desc: "Grow your business and manage clients effortlessly.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    points: ["Publish packages on the marketplace", "Manage clients in one dashboard", "Send plan updates via WhatsApp"],
  },
  {
    title: "For Admins",
    desc: "Full visibility into your platform's growth.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    points: ["Track subscriptions & revenue", "Manage all users", "Confirm payments"],
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect(homeForRole(session.user.role));

  return (
    <div className="bg-mesh flex min-h-full flex-col">
      {/* Nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Logo href="/" />
        <div className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" size="sm">
            Log in
          </ButtonLink>
          <ButtonLink href="/register" size="sm">
            Get started
          </ButtonLink>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 text-center md:pt-20">
        <div className="animate-fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-light px-4 py-1.5 text-sm font-medium text-brand-dark">
          <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
          The fitness coaching marketplace
        </div>

        <h1 className="animate-fade-up-delay-1 mx-auto mt-8 max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
          Connect with coaches.
          <span className="bg-gradient-to-r from-brand to-emerald-400 bg-clip-text text-transparent">
            {" "}Reach your goals.
          </span>
        </h1>

        <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          FitNexus connects members with expert coaches and gives coaches the
          tools to manage clients, build plans, and grow their business.
        </p>

        <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/register" size="lg">
            Join as a member
          </ButtonLink>
          <ButtonLink href="/register?role=coach" variant="outline" size="lg">
            Become a coach
          </ButtonLink>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 border-t border-border pt-10">
          {[
            { n: "500+", l: "Expert coaches" },
            { n: "10,000+", l: "Active members" },
            { n: "4.9★", l: "Average rating" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <p className="text-2xl font-bold tracking-tight">{s.n}</p>
              <p className="text-sm text-muted">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto grid w-full max-w-6xl gap-6 px-6 pb-24 md:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="group rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-300 hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light text-brand transition-transform group-hover:scale-110">
              {f.icon}
            </div>
            <h2 className="text-lg font-bold tracking-tight">{f.title}</h2>
            <p className="mt-1 text-sm text-muted">{f.desc}</p>
            <ul className="mt-5 space-y-2.5">
              {f.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-muted">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mx-auto mb-24 w-full max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1222] to-[#064e3b] px-8 py-14 text-center md:px-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              Ready to transform your fitness journey?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/60">
              Join thousands of members and coaches already on FitNexus.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonLink href="/register" size="lg">
                Get started free
              </ButtonLink>
              <Link
                href="/login"
                className="inline-flex h-12 items-center rounded-xl px-7 text-base font-medium text-white/80 transition-colors hover:text-white"
              >
                I have an account →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

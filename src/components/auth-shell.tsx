import { Logo } from "@/components/logo";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="bg-mesh flex min-h-full flex-1">
      {/* Left panel — desktop only */}
      <div className="relative hidden w-[45%] overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c1222] via-[#111827] to-[#064e3b]" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-brand blur-3xl" />
          <div className="absolute bottom-20 right-10 h-56 w-56 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative z-10">
          <Logo href="/" size="lg" className="[&_span:last-child]:text-white" />
        </div>
        <div className="relative z-10 space-y-6">
          <blockquote className="text-2xl font-semibold leading-snug tracking-tight text-white">
            &ldquo;Your body can stand almost anything. It&apos;s your mind you
            have to convince.&rdquo;
          </blockquote>
          <p className="text-sm text-white/60">
            Connect with expert coaches. Track progress. Reach your goals.
          </p>
          <div className="flex gap-8 pt-4">
            {[
              { n: "500+", l: "Coaches" },
              { n: "10k+", l: "Members" },
              { n: "98%", l: "Satisfaction" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-bold text-white">{s.n}</p>
                <p className="text-xs text-white/50">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} FitNexus
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="mb-8 lg:hidden">
            <Logo href="/" className="justify-center" />
          </div>
          <div className="rounded-2xl border border-border bg-card/80 p-8 shadow-xl shadow-black/5 backdrop-blur-sm">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-1.5 text-sm text-muted">{subtitle}</p>
            ) : null}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/** Compact page intro used by every page except the homepage. */
export function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-16 pt-32 lg:pt-40">
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--primary)_14%,transparent)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="bg-gradient-brand pointer-events-none absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full opacity-15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-6">
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-teal">
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display max-w-4xl text-4xl font-bold leading-[1.08] text-foreground md:text-6xl"
        >
          {title}
        </motion.h1>
        {children && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}

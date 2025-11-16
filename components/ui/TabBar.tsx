"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const links = [
  { href: "/invest", label: "Invest", icon: "💼" },
  { href: "/team", label: "Team", icon: "🤝" },
  { href: "/mine", label: "Profile", icon: "👤" },
];

export default function TabBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        setUser((data as any)?.user ?? null);
      } catch (err) {
        setUser(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  // Desktop/main nav: hidden on small screens
  // Mobile: if not logged in show Sign In / Sign Up buttons
  return (
    <>
      <nav className="hidden md:flex tab-bar items-center gap-3" aria-label="Primary">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`tab-bar__link${isActive ? " tab-bar__link--active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <span className="tab-bar__icon" aria-hidden>{link.icon}</span>
              <span className="tab-bar__label">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile auth buttons when user not logged in */}
      {!user && (
        <div className="flex md:hidden w-full justify-center gap-3 py-2">
          <Link
            href="/signin"
            className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold touch-manipulation"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg bg-sky-500 text-white font-semibold touch-manipulation"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
}

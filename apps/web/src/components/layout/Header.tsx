"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../lib/auth";
import { Button } from "../ui";

const navLinks = [
  { href: "/than-so-hoc", label: "Thần số học" },
  { href: "/tarot", label: "Tarot" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/#faq", label: "FAQ" },
  { href: "/legal/privacy", label: "Bảo mật" },
  { href: "/legal/terms", label: "Điều khoản" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    pathname.startsWith(`${href}/`) ||
    (href.startsWith("/#") && pathname === "/");

  return (
    <a
      className={[
        "px-3 py-2 text-sm font-bold transition-colors duration-200",
        isActive ? "text-white" : "text-[var(--bm-text-soft)]/90",
        "hover:text-white focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-[var(--bm-primary-soft)] focus-visible:ring-offset-2",
        "focus-visible:ring-offset-[var(--bm-bg-void)]",
      ].join(" ")}
      href={href}
    >
      {label}
    </a>
  );
}

function Spinner() {
  return (
    <span
      aria-label="Đang tải"
      className="inline-block size-4 animate-spin rounded-full border-2 border-[var(--bm-border-subtle)] border-t-[var(--bm-primary-soft)]"
    />
  );
}

function AccountArea() {
  const { user, loading, isAnonymous, signInWithGoogle, linkAnonymousToGoogle, signOutFn } =
    useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <Button onClick={signInWithGoogle} size="sm" variant="primary">
        Đăng nhập
      </Button>
    );
  }

  if (isAnonymous) {
    return (
      <div className="flex items-center gap-2">
        <span className="inline-flex min-h-9 items-center rounded-full border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] px-3 text-sm text-[var(--bm-text-soft)]">
          Khách
        </span>
        <Button onClick={linkAnonymousToGoogle} size="sm" variant="secondary">
          Liên kết Google
        </Button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={[
          "inline-flex min-h-9 items-center gap-2 rounded-full border px-4",
          "border-[var(--bm-border-gold)] bg-[rgba(251,191,36,0.08)]",
          "text-sm font-bold text-white",
          "hover:border-[var(--bm-gold-bright)] hover:bg-[rgba(251,191,36,0.12)]",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-[var(--bm-primary-soft)] focus-visible:ring-offset-2",
          "focus-visible:ring-offset-[var(--bm-bg-void)] transition-colors",
        ].join(" ")}
        onClick={() => setIsOpen((v) => !v)}
        type="button"
      >
        {user.photoURL ? (
          <img
            alt=""
            className="size-7 rounded-full border border-[var(--bm-border-gold)] object-cover"
            height={28}
            referrerPolicy="no-referrer"
            src={user.photoURL}
            width={28}
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-full bg-[var(--bm-primary)] text-xs text-white"
          >
            {(user.displayName ?? user.email ?? "T").slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="max-w-[120px] truncate">
          {user.displayName ?? user.email ?? "Tài khoản"}
        </span>
        <span aria-hidden="true" className={isOpen ? "rotate-180 transition-transform" : "transition-transform"}>
          ⌄
        </span>
      </button>

      {isOpen ? (
        <div
          className={[
            "absolute right-0 top-full z-50 mt-2 min-w-[160px] rounded-xl",
            "border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-panel)]",
            "shadow-[var(--bm-shadow-panel)] py-1",
          ].join(" ")}
          role="menu"
        >
          <a
            className="block px-4 py-2 text-sm text-[var(--bm-text-soft)] hover:bg-[var(--bm-bg-glass)] hover:text-[var(--bm-text-main)]"
            href="/account"
            onClick={() => setIsOpen(false)}
            role="menuitem"
          >
            Quản lý tài khoản
          </a>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-[var(--bm-text-soft)] hover:bg-[var(--bm-bg-glass)] hover:text-[var(--bm-danger-soft)]"
            onClick={() => {
              setIsOpen(false);
              void signOutFn();
            }}
            role="menuitem"
            type="button"
          >
            Đăng xuất
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--bm-border-subtle)] bg-[rgba(10,5,20,0.82)] backdrop-blur-xl">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--bm-gold-bright)] to-transparent opacity-50" />
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <a
          className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-xl font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bm-primary-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bm-bg-void)]"
          href="/"
        >
          <img
            alt=""
            aria-hidden="true"
            className="size-7 shrink-0 rounded-lg object-cover shadow-[0_0_12px_rgba(253,224,71,0.3)]"
            height={28}
            src="/favicon.png"
            width={28}
          />
          Bản Mệnh
        </a>

        <nav
          aria-label="Điều hướng chính"
          className="hidden items-center gap-1 rounded-full border border-[var(--bm-border-subtle)] bg-[rgba(255,255,255,0.03)] px-2 py-1 lg:flex"
        >
          {navLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <AccountArea />
        </div>

        <button
          aria-expanded={mobileOpen}
          aria-label="Mở menu"
          className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--bm-border-subtle)] bg-[var(--bm-bg-glass)] text-[var(--bm-text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bm-primary-soft)] lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          type="button"
        >
          <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[var(--bm-border-subtle)] bg-[rgba(10,5,20,0.94)] px-5 py-4 lg:hidden">
          <nav aria-label="Điều hướng mobile" className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <NavLink key={link.href} {...link} />
            ))}
            <div className="pt-3">
              <AccountArea />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

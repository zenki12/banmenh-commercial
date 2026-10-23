"use client";

import { useEffect, type ReactNode } from "react";
import { BackToDashboard } from "./BackToDashboard";

type ContainerWidth = "narrow" | "default" | "wide";

type PageShellProps = {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
  containerWidth?: ContainerWidth;
};

const widthClasses: Record<ContainerWidth, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
};

export function PageShell({
  title,
  subtitle,
  showBack = true,
  backHref = "/",
  backLabel = "Dashboard",
  actions,
  children,
  containerWidth = "default",
}: PageShellProps) {
  const hasTopRow = showBack || actions;
  const hasTitleBlock = title || subtitle;

  useEffect(() => {
    if (!title) return;

    const pageTitle = `${title} | Bản Mệnh`;
    const syncTitle = () => {
      if (document.title !== pageTitle) {
        document.title = pageTitle;
      }
    };

    syncTitle();
    const observer = new MutationObserver(syncTitle);
    observer.observe(document.head, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [title]);

  return (
    <section
      className={[
        "mx-auto w-full px-5 pt-8 pb-10 text-[var(--bm-text-main)] sm:px-8 sm:pt-10 sm:pb-16",
        widthClasses[containerWidth],
      ].join(" ")}
    >
      {hasTopRow ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>{showBack ? <BackToDashboard href={backHref} label={backLabel} /> : null}</div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      ) : null}

      {hasTitleBlock ? (
        <header className={hasTopRow ? "mt-8 max-w-3xl" : "max-w-3xl"}>
          {title ? <h1 className="text-gradient-purple">{title}</h1> : null}
          {subtitle ? <p className="mt-5 text-[var(--bm-text-soft)]">{subtitle}</p> : null}
        </header>
      ) : null}

      <div className={hasTitleBlock || hasTopRow ? "mt-10" : undefined}>
        {children}
      </div>
    </section>
  );
}

"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";

type SectionLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "onClick"> & {
  children: ReactNode;
  sectionId: string;
  onNavigate?: () => void;
};

const shouldUseNativeLink = (event: MouseEvent<HTMLAnchorElement>) =>
  event.defaultPrevented ||
  event.button !== 0 ||
  event.metaKey ||
  event.altKey ||
  event.ctrlKey ||
  event.shiftKey;

const getCleanCurrentUrl = () => `${window.location.pathname}${window.location.search}`;

export default function SectionLink({ children, sectionId, onNavigate, ...props }: SectionLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (shouldUseNativeLink(event)) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    event.preventDefault();
    onNavigate?.();

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", getCleanCurrentUrl());
  };

  return (
    <a {...props} href={`#${sectionId}`} onClick={handleClick}>
      {children}
    </a>
  );
}

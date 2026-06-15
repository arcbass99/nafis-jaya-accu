import type { ReactNode } from "react";

type PageIntroProps = {
  kicker: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export default function PageIntro({ kicker, title, description, children }: PageIntroProps) {
  return (
    <section className="section page-intro-section" aria-labelledby="page-intro-title">
      <div className="page-intro glass-panel">
        <p className="section-kicker">{kicker}</p>
        <h1 id="page-intro-title">{title}</h1>
        <p>{description}</p>
        {children ? <div className="page-intro-actions">{children}</div> : null}
      </div>
    </section>
  );
}

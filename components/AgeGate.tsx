"use client";
import { useEffect, useState } from "react";

export function AgeGate({ title, text, ok, leave }: { title: string; text: string; ok: string; leave: string }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!document.cookie.includes("age_ok=1")) {
      setOpen(true);
      document.body.style.overflow = "hidden";
    }
  }, []);
  if (!open) return null;
  return (
    <div className="agegate is-open" role="dialog" aria-modal="true" aria-labelledby="gate-t">
      <div className="agegate__card">
        <img src="/brand/favicon.svg" width={56} height={56} alt="" />
        <div className="agegate__title" id="gate-t">{title}</div>
        <p className="muted">{text}</p>
        <div className="agegate__actions">
          <button
            className="btn btn--primary"
            onClick={() => {
              document.cookie = `age_ok=1; max-age=${60 * 60 * 24 * 30}; path=/; SameSite=Lax`;
              document.body.style.overflow = "";
              setOpen(false);
            }}
          >
            {ok}
          </button>
          <a className="btn" href="https://www.google.com" rel="nofollow">{leave}</a>
        </div>
      </div>
    </div>
  );
}

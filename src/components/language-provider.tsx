"use client";

import { Fragment, useEffect, useState } from "react";
import { applyStoredLanguage, subscribeLanguage } from "@/lib/translations";

/**
 * Keeps the UI language in sync without breaking hydration.
 *
 * Both the server and the first client render use the default language, so the
 * markup matches. After mount we apply the language saved in localStorage and
 * re-render the subtree (via the changing key) so every t() call re-reads it.
 * Live switches from setLanguage() flow through the same subscription.
 */
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const changed = applyStoredLanguage();
    const unsubscribe = subscribeLanguage(() => setVersion((v) => v + 1));
    if (changed) setVersion((v) => v + 1);
    return unsubscribe;
  }, []);

  return <Fragment key={version}>{children}</Fragment>;
}

"use client";

import { useEffect } from "react";

/** Retire the old language preference without touching profile or course data. */
export default function EnglishOnly() {
  useEffect(() => {
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
    document.body.dir = "ltr";
    document.body.dataset.language = "en";

    try {
      window.localStorage.setItem("capacity-connect-language", "en");
    } catch {
      // Storage can be unavailable. The server-rendered UI is still English/LTR.
    }
  }, []);

  return null;
}

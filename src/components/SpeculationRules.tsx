"use client";

import { useEffect } from "react";

export default function SpeculationRules() {
  useEffect(() => {
    // Check if browser supports speculation rules
    const supportsSpeculationRules = 
      typeof HTMLScriptElement !== "undefined" && 
      (HTMLScriptElement as any).supports && 
      (HTMLScriptElement as any).supports("speculationrules");

    if (supportsSpeculationRules) {
      // Check if already injected to prevent duplicates
      if (document.getElementById("speculation-rules")) return;

      const script = document.createElement("script");
      script.id = "speculation-rules";
      script.type = "speculationrules";
      script.textContent = JSON.stringify({
        prerender: [{
          where: { href_matches: "/*" },
          eagerness: "moderate"
        }]
      });
      document.head.appendChild(script);
    }
  }, []);

  return null;
}

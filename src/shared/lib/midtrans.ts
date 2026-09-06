export const loadSnapScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.snap) {
      resolve();
      return;
    }

    const scriptId = "midtrans-snap-script";
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (existing) {
      if (window.snap) {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Failed to load Midtrans payment script")));
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "Mid-client-4qrD7aAxFaMcAa8Q");
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Midtrans payment script"));
    document.body.appendChild(script);
  });
};

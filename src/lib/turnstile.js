let loading;

// Load once across React StrictMode, route changes and language switches.
export function loadTurnstile() {
  if (window.turnstile?.render) return Promise.resolve(window.turnstile);
  if (loading) return loading;

  loading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    const timeout = setTimeout(() => fail(), 15000);

    function fail() {
      clearTimeout(timeout);
      script.remove();
      loading = undefined;
      reject(new Error("Turnstile could not be loaded"));
    }

    script.onerror = fail;
    script.onload = () => {
      if (!window.turnstile?.render) return fail();
      clearTimeout(timeout);
      resolve(window.turnstile);
    };
    document.head.appendChild(script);
  });

  return loading;
}

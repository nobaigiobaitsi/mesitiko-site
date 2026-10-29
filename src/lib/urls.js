export function normalizeBasePath(value = "/") {
  if (!value || value === "/") return "/";
  if (!value.startsWith("/") || value.includes("..") || /[?#\\]/.test(value))
    throw new Error(
      "VITE_BASE_PATH must be / or an absolute path such as /mesitiko-site/.",
    );
  return `/${value.replace(/^\/+|\/+$/g, "")}/`;
}

export function withBase(path, base = "/") {
  return `${normalizeBasePath(base).replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function absoluteUrl(path, origin, base = "/") {
  return new URL(withBase(path, base), origin).href;
}

export function legacyHashTarget(hash, base = "/") {
  if (!/^#\/(?![/\\])/.test(hash) || hash.includes("\\")) return null;
  return withBase(hash.slice(1), base);
}

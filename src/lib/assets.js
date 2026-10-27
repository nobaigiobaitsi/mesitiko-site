export function asset(path) {
  if (!path || /^(https?:|data:|mailto:|tel:)/.test(path)) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

export function localizeCss(css) {
  return css.replaceAll(
    'url("/assets/',
    `url("${import.meta.env.BASE_URL}assets/`,
  );
}

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const ROUTE_PREFIX = base;

export const APP_URL = {
  index: `${base}/`,
  positionList: `${base}/position-list/`,
} as const;

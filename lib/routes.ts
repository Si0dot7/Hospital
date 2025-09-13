import type { Route } from "next";

export function toRoute(path: string): Route {
  return path && path.startsWith("/") ? (path as Route) : ("/" as Route);
}

export function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

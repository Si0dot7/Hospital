import * as React from "react";
import clsx from "clsx";
export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default"|"secondary"|"outline" }) {
  const styles = { default:"bg-blue-100 text-blue-700", secondary:"bg-green-100 text-green-700", outline:"border border-gray-300 text-gray-700" }[variant];
  return <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", styles)}>{children}</span>;
}

import * as React from "react";
import clsx from "clsx";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default"|"outline"|"secondary"; className?: string };
export function Button({ variant="default", className, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50";
  const styles = { default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500", outline:"border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-400", secondary:"bg-gray-900 text-white hover:bg-black focus:ring-gray-700" }[variant];
  return <button className={clsx(base, styles, className)} {...props} />;
}

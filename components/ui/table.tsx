import * as React from "react";
import clsx from "clsx";

export function Table(
  { className, ...props }: React.TableHTMLAttributes<HTMLTableElement>
) {
  return <table className={clsx("w-full border-collapse", className)} {...props} />;
}

export function TableHeader(
  { className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <thead className={clsx("bg-gray-50", className)} {...props} />;
}

export function TableBody(
  { className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>
) {
  return <tbody className={clsx("divide-y", className)} {...props} />;
}

export function TableRow(
  { className, ...props }: React.HTMLAttributes<HTMLTableRowElement>
) {
  return <tr className={clsx("border-b last:border-0", className)} {...props} />;
}

export function TableHead(
  { className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>
) {
  return (
    <th
      className={clsx(
        "px-3 py-2 text-left text-sm font-semibold text-gray-700",
        className
      )}
      {...props}
    />
  );
}

export function TableCell(
  { className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>
) {
  return (
    <td className={clsx("px-3 py-2 text-sm text-gray-800", className)} {...props} />
  );
}

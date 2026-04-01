import type { ReactNode } from "react";

interface Column<T> {
  key: keyof T;
  label: string;
  align?: "left" | "right";
  render?: (row: T) => ReactNode;
}

interface SimpleTableProps<T> {
  columns: Column<T>[];
  rows: T[];
}

export function SimpleTable<T extends { id: string }>({ columns, rows }: SimpleTableProps<T>) {
  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50/80 text-left text-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-5 py-4 font-medium ${column.align === "right" ? "text-right" : "text-left"}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-line transition hover:bg-slate-50">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-5 py-4 align-middle ${column.align === "right" ? "text-right" : "text-left"}`}
                  >
                    {column.render ? column.render(row) : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

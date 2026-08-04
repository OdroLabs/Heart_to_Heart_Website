import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { getEntity } from "@/lib/admin-config";

/** Wraps a value in quotes and escapes embedded quotes, per RFC 4180. */
function csvCell(value: unknown): string {
  if (value == null) return "";
  const text = value instanceof Date ? value.toISOString() : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { entity: string } }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entity = getEntity(params.entity);
  if (!entity || !entity.exportable) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const rows: Record<string, any>[] = await (prisma as any)[entity.model].findMany({
    orderBy: entity.orderBy,
  });

  const columns = entity.listFields.map((f) => f.name);
  const header = entity.listFields.map((f) => csvCell(f.label || f.name)).join(",");
  const body = rows
    .map((row) => columns.map((col) => csvCell(row[col])).join(","))
    .join("\n");
  const csv = `${header}\n${body}\n`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${entity.slug}.csv"`,
    },
  });
}

import { prisma } from "@/lib/prisma";

const TICKET_COUNTER_KEY = "supportTicket";

export async function nextTicketNumber(): Promise<number> {
  const counter = await prisma.counter.upsert({
    where: { key: TICKET_COUNTER_KEY },
    create: { key: TICKET_COUNTER_KEY, value: 1 },
    update: { value: { increment: 1 } },
  });
  return counter.value;
}

export function formatTicketNumber(n: number | null | undefined): string {
  if (n == null) return "#—";
  return `#${String(n).padStart(4, "0")}`;
}

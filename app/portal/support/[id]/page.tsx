import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { TicketThread } from "@/components/shared/ticket-thread";
import { formatTicketNumber } from "@/lib/ticket-number";

export const dynamic = "force-dynamic";

export default async function PortalTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  const ticket = await prisma.supportTicket.findFirst({
    where: { id, authorId: session!.user.id },
    include: {
      messages: {
        where: { isInternal: false },
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { name: true, email: true, role: true } },
        },
      },
    },
  });
  if (!ticket) notFound();

  return (
    <div>
      <PageHeader
        title={`Ticket ${formatTicketNumber(ticket.number)}`}
        breadcrumbs={[
          { label: "Espace", href: "/portal" },
          { label: "Support", href: "/portal/support" },
          { label: `${formatTicketNumber(ticket.number)} · ${ticket.subject}` },
        ]}
        actions={
          <Button variant="outline" size="sm" asChild>
            <Link href="/portal/support">
              <ArrowLeft className="h-4 w-4" /> Retour
            </Link>
          </Button>
        }
      />
      <TicketThread
        ticketId={ticket.id}
        subject={ticket.subject}
        status={ticket.status}
        priority={ticket.priority}
        category={ticket.category}
        messages={ticket.messages.map((m) => ({
          id: m.id,
          content: m.content,
          createdAt: m.createdAt,
          author: {
            name: m.author.name,
            email: m.author.email,
            role: m.author.role,
          },
        }))}
        scope="portal"
      />
    </div>
  );
}

import { prisma } from "@/lib/prisma";

export async function getAdminEmails(): Promise<string[]> {
  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  });
  return admins.map((a) => a.email).filter(Boolean);
}

import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";
import { he, formatPrayerName, genderLabels, statusLabels, roleLabels } from "@/lib/locale";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Shield, Users, Clock } from "lucide-react";
import { ModerationCard } from "@/components/moderation-card";
import { MemberRow } from "@/components/member-row";

interface ManagePageProps {
  params: Promise<{ id: string }>;
}

export default async function ManagePage({ params }: ManagePageProps) {
  const { id } = await params;
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  const list = await db.prayerList.findUnique({
    where: { id },
    include: {
      owner: true,
      members: {
        include: { user: true },
        orderBy: { joinedAt: "asc" },
      },
    },
  });

  if (!list) notFound();

  // Check permissions
  const isOwner = user.id === list.ownerId;
  const membership = list.members.find((m) => m.userId === user.id);
  const isAdmin = isOwner || membership?.role === "ADMIN";

  if (!isAdmin) redirect(`/list/${id}`);

  // Fetch pending persons
  const pendingPersons = await db.pendingPerson.findMany({
    where: {
      listId: id,
      moderationStatus: "PENDING",
    },
    include: { addedBy: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-8">
      {/* Back link */}
      <Link
        href={`/list/${id}`}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
      >
        <ArrowRight className="w-4 h-4" />
        {he.back} ל{list.name}
      </Link>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Shield className="w-8 h-8 text-blue-600" />
        {he.manage} — {list.name}
      </h1>

      {/* Moderation Queue */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" />
          {he.moderationQueue}
          {pendingPersons.length > 0 && (
            <span className="bg-orange-100 text-orange-700 text-sm px-2 py-0.5 rounded-full">
              {pendingPersons.length}
            </span>
          )}
        </h2>

        {pendingPersons.length === 0 ? (
          <p className="text-gray-400 py-4">{he.noPending}</p>
        ) : (
          <div className="space-y-3">
            {pendingPersons.map((pending) => (
              <ModerationCard key={pending.id} pending={pending} />
            ))}
          </div>
        )}
      </section>

      {/* Members */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          {he.members} ({list.members.length})
        </h2>

        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {/* Owner row */}
          <div className="flex items-center justify-between p-4">
            <div>
              <span className="font-medium">
                {list.owner.displayName || list.owner.clerkId}
              </span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
              {he.owner}
            </span>
          </div>

          {/* Member rows */}
          {list.members
            .filter((m) => m.userId !== list.ownerId)
            .map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                isOwner={isOwner}
              />
            ))}
        </div>
      </section>
    </div>
  );
}

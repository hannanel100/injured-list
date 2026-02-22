import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";
import { he, statusLabels, formatPrayerName, listTypeLabels } from "@/lib/locale";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Settings, Shield, Users, UserPlus } from "lucide-react";
import { PersonCard } from "@/components/person-card";
import { JoinListButton } from "@/components/join-list-button";
import { ShareListButton } from "@/components/share-list-button";

interface ListPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListPage({ params }: ListPageProps) {
  const { id } = await params;
  const user = await getOrCreateDbUser();

  const list = await db.prayerList.findUnique({
    where: { id },
    include: {
      persons: {
        orderBy: { createdAt: "desc" },
      },
      owner: true,
      members: {
        include: { user: true },
      },
      _count: {
        select: {
          persons: true,
          members: true,
          pendingPersons: true,
        },
      },
    },
  });

  if (!list) notFound();

  const isOwner = user?.id === list.ownerId;
  const membership = user
    ? list.members.find((m) => m.userId === user.id)
    : null;
  const isAdmin = isOwner || membership?.role === "ADMIN";
  const isMember = !!membership;
  const canAdd = isOwner || isAdmin || membership?.role === "CONTRIBUTOR" || isMember;

  // Count pending items for badge
  const pendingCount = list._count.pendingPersons;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{list.name}</h1>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                list.type === "COMMUNITY"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {listTypeLabels[list.type]}
            </span>
          </div>
          {list.description && (
            <p className="text-gray-500 mt-1">{list.description}</p>
          )}
          <div className="flex gap-4 mt-2 text-sm text-gray-400">
            <span>{list._count.persons} שמות</span>
            {list.type === "COMMUNITY" && (
              <span>
                {list._count.members} {he.memberCount}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {/* Share button */}
          <ShareListButton
            listName={list.name}
            listId={list.id}
            personCount={list._count.persons}
          />

          {/* Join button for community lists */}
          {list.type === "COMMUNITY" && user && !isOwner && !isMember && (
            <JoinListButton listId={list.id} />
          )}

          {/* Add person button */}
          {user && (isOwner || canAdd) && (
            <Link
              href={`/list/${list.id}/add`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {he.addPerson}
            </Link>
          )}

          {/* Manage button (owner/admin only) */}
          {isAdmin && list.type === "COMMUNITY" && (
            <Link
              href={`/list/${list.id}/manage`}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 relative"
            >
              <Shield className="w-4 h-4" />
              {he.manage}
              {pendingCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Link>
          )}

          {/* Settings button (owner only) */}
          {isOwner && (
            <Link
              href={`/list/${list.id}/settings`}
              className="border border-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      {/* Person List */}
      {list.persons.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">{he.noPeople}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.persons.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
              canEdit={isOwner || isAdmin || person.addedById === user?.id}
              listId={list.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

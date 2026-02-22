import Link from "next/link";
import { he, listTypeLabels } from "@/lib/locale";
import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Plus, List, Users } from "lucide-react";

export default async function DashboardPage() {
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  // Fetch user's owned lists
  const ownedLists = await db.prayerList.findMany({
    where: { ownerId: user.id },
    include: {
      _count: { select: { persons: true, members: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Fetch lists user is a member of (but doesn't own)
  const memberships = await db.listMember.findMany({
    where: { userId: user.id },
    include: {
      list: {
        include: {
          _count: { select: { persons: true, members: true } },
        },
      },
    },
  });

  const memberLists = memberships
    .filter((m) => m.list.ownerId !== user.id)
    .map((m) => m.list);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{he.myLists}</h1>
        <Link
          href="/dashboard/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {he.createList}
        </Link>
      </div>

      {/* Owned Lists */}
      {ownedLists.length === 0 && memberLists.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <List className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">{he.noLists}</p>
          <p className="mt-2 text-sm">לחץ על &quot;{he.createList}&quot; כדי להתחיל</p>
        </div>
      ) : (
        <>
          {ownedLists.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700">
                רשימות שיצרתי
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ownedLists.map((list) => (
                  <Link
                    key={list.id}
                    href={`/list/${list.id}`}
                    className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-semibold">{list.name}</h3>
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
                      <p className="text-gray-500 mt-1 text-sm line-clamp-2">
                        {list.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-400">
                      <span>{list._count.persons} שמות</span>
                      {list.type === "COMMUNITY" && (
                        <span>
                          {list._count.members} {he.memberCount}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {memberLists.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                <Users className="w-5 h-5" />
                רשימות שהצטרפתי אליהן
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {memberLists.map((list) => (
                  <Link
                    key={list.id}
                    href={`/list/${list.id}`}
                    className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-semibold">{list.name}</h3>
                    {list.description && (
                      <p className="text-gray-500 mt-1 text-sm line-clamp-2">
                        {list.description}
                      </p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-gray-400">
                      <span>{list._count.persons} שמות</span>
                      <span>
                        {list._count.members} {he.memberCount}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

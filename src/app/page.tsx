import Link from "next/link";
import { he } from "@/lib/locale";
import { db } from "@/lib/db";
import { Heart, Users, Plus } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

export default async function HomePage() {
  // Fetch public community lists
  let communityLists: {
    id: string;
    name: string;
    description: string | null;
    _count: { persons: number; members: number };
  }[] = [];
  try {
    communityLists = await db.prayerList.findMany({
      where: { type: "COMMUNITY" },
      include: {
        _count: {
          select: { persons: true, members: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch {
    // DB not connected yet — show empty
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 space-y-6">
        <div className="flex justify-center">
          <Heart className="w-16 h-16 text-blue-600 fill-blue-100" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">{he.heroTitle}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {he.heroSubtitle}
        </p>
        <div className="flex gap-4 justify-center">
          <SignedIn>
            <Link
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {he.getStarted}
            </Link>
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-up"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {he.getStarted}
            </Link>
          </SignedOut>
        </div>
      </section>

      {/* Community Lists */}
      {communityLists.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            {he.communityLists}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {communityLists.map((list) => (
              <Link
                key={list.id}
                href={`/list/${list.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {list.name}
                </h3>
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
    </div>
  );
}

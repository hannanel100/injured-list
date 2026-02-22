"use client";

import { joinCommunityList } from "@/app/actions";
import { he } from "@/lib/locale";
import { UserPlus } from "lucide-react";

export function JoinListButton({ listId }: { listId: string }) {
  const handleJoin = async () => {
    await joinCommunityList(listId);
  };

  return (
    <button
      onClick={handleJoin}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4" />
      {he.joinList}
    </button>
  );
}

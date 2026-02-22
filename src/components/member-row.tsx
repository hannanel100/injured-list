"use client";

import { roleLabels, he } from "@/lib/locale";
import { updateMemberRole, removeMember } from "@/app/actions";
import { Trash2 } from "lucide-react";

interface MemberRowProps {
  member: {
    id: string;
    role: "VIEWER" | "CONTRIBUTOR" | "ADMIN";
    user: {
      displayName: string | null;
      clerkId: string;
    };
  };
  isOwner: boolean;
}

export function MemberRow({ member, isOwner }: MemberRowProps) {
  const handleRoleChange = async (newRole: string) => {
    await updateMemberRole(member.id, newRole as "VIEWER" | "CONTRIBUTOR" | "ADMIN");
  };

  const handleRemove = async () => {
    if (confirm(he.confirmDelete)) {
      await removeMember(member.id);
    }
  };

  return (
    <div className="flex items-center justify-between p-4">
      <div>
        <span className="font-medium">
          {member.user.displayName || member.user.clerkId}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {isOwner ? (
          <>
            <select
              value={member.role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 bg-white"
            >
              <option value="VIEWER">{he.viewer}</option>
              <option value="CONTRIBUTOR">{he.contributor}</option>
              <option value="ADMIN">{he.admin}</option>
            </select>
            <button
              onClick={handleRemove}
              className="text-red-500 hover:text-red-700 p-1"
              title={he.removeFromList}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {roleLabels[member.role]}
          </span>
        )}
      </div>
    </div>
  );
}

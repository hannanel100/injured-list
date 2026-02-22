"use client";

import { formatPrayerName, genderLabels, statusLabels, he } from "@/lib/locale";
import { approvePendingPerson, rejectPendingPerson } from "@/app/actions";
import { Check, X, Heart } from "lucide-react";

interface ModerationCardProps {
  pending: {
    id: string;
    firstName: string;
    lastName: string | null;
    motherName: string;
    gender: "MALE" | "FEMALE";
    status: "INJURED" | "SICK" | "RECOVERING" | "HEALED";
    injuryDate: Date | null;
    notes: string | null;
    createdAt: Date;
    addedBy: {
      displayName: string | null;
      clerkId: string;
    };
  };
}

export function ModerationCard({ pending }: ModerationCardProps) {
  const prayerName = formatPrayerName(
    pending.firstName,
    pending.motherName,
    pending.gender
  );

  return (
    <div className="bg-white rounded-xl border border-orange-200 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400 fill-red-100" />
          <span className="text-lg font-bold">{prayerName}</span>
        </div>
        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
          {he.pendingApproval}
        </span>
      </div>

      {pending.lastName && (
        <p className="text-sm text-gray-500">
          {pending.firstName} {pending.lastName}
        </p>
      )}

      <div className="flex gap-4 text-sm text-gray-400">
        <span>{genderLabels[pending.gender]}</span>
        <span>{statusLabels[pending.status]}</span>
        <span>
          נוסף ע&quot;י {pending.addedBy.displayName || pending.addedBy.clerkId}
        </span>
      </div>

      {pending.notes && (
        <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
          {pending.notes}
        </p>
      )}

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => approvePendingPerson(pending.id)}
          className="bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
        >
          <Check className="w-4 h-4" />
          {he.approve}
        </button>
        <button
          onClick={() => rejectPendingPerson(pending.id)}
          className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          {he.reject}
        </button>
      </div>
    </div>
  );
}

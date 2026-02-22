"use client";

import { formatPrayerName, statusLabels, genderLabels, he } from "@/lib/locale";
import { deletePerson } from "@/app/actions";
import { Heart, Trash2, Edit, Calendar, MessageSquare } from "lucide-react";
import Link from "next/link";

interface PersonCardProps {
  person: {
    id: string;
    firstName: string;
    lastName: string | null;
    motherName: string;
    gender: "MALE" | "FEMALE";
    status: "INJURED" | "SICK" | "RECOVERING" | "HEALED";
    injuryDate: Date | null;
    notes: string | null;
    createdAt: Date;
  };
  canEdit: boolean;
  listId: string;
}

const statusColors: Record<string, string> = {
  INJURED: "bg-red-100 text-red-700",
  SICK: "bg-orange-100 text-orange-700",
  RECOVERING: "bg-yellow-100 text-yellow-700",
  HEALED: "bg-green-100 text-green-700",
};

export function PersonCard({ person, canEdit, listId }: PersonCardProps) {
  const prayerName = formatPrayerName(
    person.firstName,
    person.motherName,
    person.gender
  );

  const handleDelete = async () => {
    if (confirm(he.confirmDelete)) {
      await deletePerson(person.id);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
      {/* Prayer Name (main display) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-400 fill-red-100" />
          <span className="text-xl font-bold text-gray-900">{prayerName}</span>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${statusColors[person.status]}`}
        >
          {statusLabels[person.status]}
        </span>
      </div>

      {/* Full name if last name exists */}
      {person.lastName && (
        <p className="text-sm text-gray-500">
          {person.firstName} {person.lastName}
        </p>
      )}

      {/* Details */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
        <span>{genderLabels[person.gender]}</span>
        {person.injuryDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(person.injuryDate).toLocaleDateString("he-IL")}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {he.dateAdded}: {new Date(person.createdAt).toLocaleDateString("he-IL")}
        </span>
      </div>

      {/* Notes */}
      {person.notes && (
        <div className="flex items-start gap-1 text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
          <MessageSquare className="w-3 h-3 mt-1 shrink-0" />
          <span>{person.notes}</span>
        </div>
      )}

      {/* Actions */}
      {canEdit && (
        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <Link
            href={`/list/${listId}/edit/${person.id}`}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <Edit className="w-3 h-3" />
            {he.edit}
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            {he.delete}
          </button>
        </div>
      )}
    </div>
  );
}

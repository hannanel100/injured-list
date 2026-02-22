import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";
import { he, listTypeLabels } from "@/lib/locale";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Settings } from "lucide-react";
import { updateList, deleteList } from "@/app/actions";

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { id } = await params;
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  const list = await db.prayerList.findUnique({ where: { id } });
  if (!list) notFound();
  if (list.ownerId !== user.id) redirect(`/list/${id}`);

  const updateListWithId = updateList.bind(null, id);
  const deleteListWithId = deleteList.bind(null, id);

  return (
    <div className="max-w-lg mx-auto space-y-8">
      {/* Back link */}
      <Link
        href={`/list/${id}`}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
      >
        <ArrowRight className="w-4 h-4" />
        {he.back} ל{list.name}
      </Link>

      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Settings className="w-8 h-8 text-gray-600" />
        {he.listSettings}
      </h1>

      {/* Edit Form */}
      <form action={updateListWithId} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {he.listName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            defaultValue={list.name}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {he.listDescription}{" "}
            <span className="text-gray-400 text-xs">({he.optional})</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={list.description || ""}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

        <div className="text-sm text-gray-500">
          <span className="font-medium">{he.listType}:</span>{" "}
          {listTypeLabels[list.type]}
          <p className="text-xs text-gray-400 mt-1">
            לא ניתן לשנות את סוג הרשימה לאחר יצירתה
          </p>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          {he.save}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="border border-red-200 rounded-xl p-5 space-y-3">
        <h2 className="text-lg font-semibold text-red-600">אזור מסוכן</h2>
        <p className="text-sm text-gray-500">
          מחיקת הרשימה תמחק את כל השמות שבה. פעולה זו בלתי הפיכה.
        </p>
        <form action={deleteListWithId}>
          <button
            type="submit"
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
            onClick={(e) => {
              if (!confirm(he.confirmDelete)) {
                e.preventDefault();
              }
            }}
          >
            {he.deleteList}
          </button>
        </form>
      </div>
    </div>
  );
}

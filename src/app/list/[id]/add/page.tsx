import { he } from "@/lib/locale";
import { addPerson } from "@/app/actions";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface AddPersonPageProps {
  params: Promise<{ id: string }>;
}

export default async function AddPersonPage({ params }: AddPersonPageProps) {
  const { id } = await params;

  const list = await db.prayerList.findUnique({ where: { id } });
  if (!list) notFound();

  const addPersonWithListId = addPerson.bind(null, id);

  return (
    <div className="max-w-lg mx-auto">
      {/* Back link */}
      <Link
        href={`/list/${id}`}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-6 text-sm"
      >
        <ArrowRight className="w-4 h-4" />
        {he.back} ל{list.name}
      </Link>

      <h1 className="text-3xl font-bold mb-8">{he.addPerson}</h1>

      <form action={addPersonWithListId} className="space-y-5">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            {he.firstName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="לדוגמה: שלמה"
          />
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            {he.lastName}{" "}
            <span className="text-gray-400 text-xs">({he.optional})</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="לדוגמה: כהן"
          />
        </div>

        {/* Mother's Name */}
        <div>
          <label htmlFor="motherName" className="block text-sm font-medium text-gray-700 mb-1">
            {he.motherName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="motherName"
            name="motherName"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="לדוגמה: רחל"
          />
          <p className="mt-1 text-xs text-gray-400">
            שם האם לצורך התפילה (לדוגמה: שלמה בן רחל)
          </p>
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {he.gender} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="MALE"
                defaultChecked
                className="w-4 h-4 text-blue-600"
              />
              <span>{he.male}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                className="w-4 h-4 text-blue-600"
              />
              <span>{he.female}</span>
            </label>
          </div>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            {he.status}
          </label>
          <select
            id="status"
            name="status"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
          >
            <option value="SICK">{he.sick}</option>
            <option value="INJURED">{he.injured}</option>
            <option value="RECOVERING">{he.recovering}</option>
            <option value="HEALED">{he.healed}</option>
          </select>
        </div>

        {/* Injury Date */}
        <div>
          <label htmlFor="injuryDate" className="block text-sm font-medium text-gray-700 mb-1">
            {he.injuryDate}{" "}
            <span className="text-gray-400 text-xs">({he.optional})</span>
          </label>
          <input
            type="date"
            id="injuryDate"
            name="injuryDate"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            {he.notes}{" "}
            <span className="text-gray-400 text-xs">({he.optional})</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            placeholder="הערות נוספות..."
          />
        </div>

        {/* Info for community lists */}
        {list.type === "COMMUNITY" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            שים לב: ברשימות קהילתיות, הוספת שמות מצריכה אישור מבעל הרשימה.
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {he.save}
          </button>
          <Link
            href={`/list/${id}`}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {he.cancel}
          </Link>
        </div>
      </form>
    </div>
  );
}

import { he } from "@/lib/locale";
import { createList } from "@/app/actions";

export default function NewListPage() {
  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-8">{he.createList}</h1>

      <form action={createList} className="space-y-6">
        {/* List Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            {he.listName} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="לדוגמה: רשימת תפילה למשפחה"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            {he.listDescription}{" "}
            <span className="text-gray-400 text-xs">({he.optional})</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            placeholder="תיאור קצר של הרשימה"
          />
        </div>

        {/* List Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {he.listType}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="PERSONAL"
                defaultChecked
                className="w-4 h-4 text-blue-600"
              />
              <span>{he.listTypePersonal}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value="COMMUNITY"
                className="w-4 h-4 text-blue-600"
              />
              <span>{he.listTypeCommunity}</span>
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            רשימה קהילתית מאפשרת לאחרים להצטרף ולהוסיף שמות (בכפוף לאישור)
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {he.save}
          </button>
          <a
            href="/dashboard"
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            {he.cancel}
          </a>
        </div>
      </form>
    </div>
  );
}

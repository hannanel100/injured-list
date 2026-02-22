import { he } from "@/lib/locale";
import { updatePerson } from "@/app/actions";
import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface EditPersonPageProps {
  params: Promise<{ id: string; personId: string }>;
}

export default async function EditPersonPage({ params }: EditPersonPageProps) {
  const { id, personId } = await params;
  const user = await getOrCreateDbUser();
  if (!user) redirect("/sign-in");

  const person = await db.person.findUnique({
    where: { id: personId },
    include: { list: true },
  });

  if (!person || person.listId !== id) notFound();

  // Check permissions
  const isOwner = person.list.ownerId === user.id;
  const isAdder = person.addedById === user.id;
  const membership = await db.listMember.findUnique({
    where: { userId_listId: { userId: user.id, listId: id } },
  });
  const isAdmin = membership?.role === "ADMIN";

  if (!isOwner && !isAdder && !isAdmin) redirect(`/list/${id}`);

  const updatePersonWithId = updatePerson.bind(null, personId);

  return (
    <div className="max-w-lg mx-auto">
      {/* Back link */}
      <Link
        href={`/list/${id}`}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mb-6 text-sm"
      >
        <ArrowRight className="w-4 h-4" />
        {he.back} ל{person.list.name}
      </Link>

      <h1 className="text-3xl font-bold mb-8">{he.editPerson}</h1>

      <form action={updatePersonWithId} className="space-y-5">
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
            defaultValue={person.firstName}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            defaultValue={person.lastName || ""}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            defaultValue={person.motherName}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
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
                defaultChecked={person.gender === "MALE"}
                className="w-4 h-4 text-blue-600"
              />
              <span>{he.male}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                defaultChecked={person.gender === "FEMALE"}
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
            defaultValue={person.status}
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
            defaultValue={
              person.injuryDate
                ? new Date(person.injuryDate).toISOString().split("T")[0]
                : ""
            }
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
            defaultValue={person.notes || ""}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
          />
        </div>

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

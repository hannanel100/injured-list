"use client";

import { he } from "@/lib/locale";

export function DeleteListButton({ deleteAction }: { deleteAction: () => Promise<void> }) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirm(he.confirmDelete)) {
      await deleteAction();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button
        type="submit"
        className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
      >
        {he.deleteList}
      </button>
    </form>
  );
}

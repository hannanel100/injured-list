"use server";

import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ListType } from "@/generated/prisma/client";

// ──────────────────────────────────────────
// LIST ACTIONS
// ──────────────────────────────────────────

export async function createList(formData: FormData) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const type = (formData.get("type") as ListType) || "PERSONAL";

  if (!name?.trim()) throw new Error("Name is required");

  const list = await db.prayerList.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      type,
      ownerId: user.id,
    },
  });

  // If community list, add the owner as ADMIN member
  if (type === "COMMUNITY") {
    await db.listMember.create({
      data: {
        userId: user.id,
        listId: list.id,
        role: "ADMIN",
      },
    });
  }

  revalidatePath("/dashboard");
  redirect(`/list/${list.id}`);
}

export async function updateList(listId: string, formData: FormData) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const list = await db.prayerList.findUnique({ where: { id: listId } });
  if (!list || list.ownerId !== user.id) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;

  if (!name?.trim()) throw new Error("Name is required");

  await db.prayerList.update({
    where: { id: listId },
    data: {
      name: name.trim(),
      description: description?.trim() || null,
    },
  });

  revalidatePath(`/list/${listId}`);
  revalidatePath("/dashboard");
}

export async function deleteList(listId: string) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const list = await db.prayerList.findUnique({ where: { id: listId } });
  if (!list || list.ownerId !== user.id) throw new Error("Unauthorized");

  await db.prayerList.delete({ where: { id: listId } });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function joinCommunityList(listId: string) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const list = await db.prayerList.findUnique({ where: { id: listId } });
  if (!list || list.type !== "COMMUNITY") throw new Error("Not a community list");

  // Check if already a member
  const existing = await db.listMember.findUnique({
    where: { userId_listId: { userId: user.id, listId } },
  });

  if (!existing) {
    await db.listMember.create({
      data: {
        userId: user.id,
        listId,
        role: "VIEWER",
      },
    });
  }

  revalidatePath(`/list/${listId}`);
  revalidatePath("/dashboard");
}

// ──────────────────────────────────────────
// PERSON ACTIONS
// ──────────────────────────────────────────

export async function addPerson(listId: string, formData: FormData) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const list = await db.prayerList.findUnique({ where: { id: listId } });
  if (!list) throw new Error("List not found");

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string | null;
  const motherName = formData.get("motherName") as string;
  const gender = formData.get("gender") as "MALE" | "FEMALE";
  const status = formData.get("status") as "INJURED" | "SICK" | "RECOVERING" | "HEALED";
  const injuryDateStr = formData.get("injuryDate") as string | null;
  const notes = formData.get("notes") as string | null;

  if (!firstName?.trim() || !motherName?.trim() || !gender) {
    throw new Error("Missing required fields");
  }

  const injuryDate = injuryDateStr ? new Date(injuryDateStr) : null;

  // For community lists where user is not the owner, create a pending person
  if (list.type === "COMMUNITY" && list.ownerId !== user.id) {
    // Check if the user is an admin
    const membership = await db.listMember.findUnique({
      where: { userId_listId: { userId: user.id, listId } },
    });

    if (membership?.role === "ADMIN") {
      // Admins can add directly
      await db.person.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName?.trim() || null,
          motherName: motherName.trim(),
          gender,
          status: status || "SICK",
          injuryDate,
          notes: notes?.trim() || null,
          listId,
          addedById: user.id,
        },
      });
    } else {
      // Others submit for moderation
      await db.pendingPerson.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName?.trim() || null,
          motherName: motherName.trim(),
          gender,
          status: status || "SICK",
          injuryDate,
          notes: notes?.trim() || null,
          listId,
          addedById: user.id,
        },
      });

      revalidatePath(`/list/${listId}`);
    }
  } else {
    // Personal list or owner of community list — add directly
    await db.person.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName?.trim() || null,
        motherName: motherName.trim(),
        gender,
        status: status || "SICK",
        injuryDate,
        notes: notes?.trim() || null,
        listId,
        addedById: user.id,
      },
    });
  }

  revalidatePath(`/list/${listId}`);
}

export async function updatePerson(personId: string, formData: FormData) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const person = await db.person.findUnique({
    where: { id: personId },
    include: { list: true },
  });
  if (!person) throw new Error("Person not found");

  // Only list owner, admins, or the person who added it can edit
  const isOwner = person.list.ownerId === user.id;
  const isAdder = person.addedById === user.id;
  const membership = await db.listMember.findUnique({
    where: { userId_listId: { userId: user.id, listId: person.listId } },
  });
  const isAdmin = membership?.role === "ADMIN";

  if (!isOwner && !isAdder && !isAdmin) throw new Error("Unauthorized");

  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string | null;
  const motherName = formData.get("motherName") as string;
  const gender = formData.get("gender") as "MALE" | "FEMALE";
  const status = formData.get("status") as "INJURED" | "SICK" | "RECOVERING" | "HEALED";
  const injuryDateStr = formData.get("injuryDate") as string | null;
  const notes = formData.get("notes") as string | null;

  await db.person.update({
    where: { id: personId },
    data: {
      firstName: firstName?.trim() || person.firstName,
      lastName: lastName?.trim() || null,
      motherName: motherName?.trim() || person.motherName,
      gender: gender || person.gender,
      status: status || person.status,
      injuryDate: injuryDateStr ? new Date(injuryDateStr) : person.injuryDate,
      notes: notes?.trim() || null,
    },
  });

  revalidatePath(`/list/${person.listId}`);
}

export async function deletePerson(personId: string) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const person = await db.person.findUnique({
    where: { id: personId },
    include: { list: true },
  });
  if (!person) throw new Error("Person not found");

  const isOwner = person.list.ownerId === user.id;
  const isAdder = person.addedById === user.id;
  const membership = await db.listMember.findUnique({
    where: { userId_listId: { userId: user.id, listId: person.listId } },
  });
  const isAdmin = membership?.role === "ADMIN";

  if (!isOwner && !isAdder && !isAdmin) throw new Error("Unauthorized");

  await db.person.delete({ where: { id: personId } });

  revalidatePath(`/list/${person.listId}`);
}

// ──────────────────────────────────────────
// MODERATION ACTIONS
// ──────────────────────────────────────────

export async function approvePendingPerson(pendingId: string) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const pending = await db.pendingPerson.findUnique({
    where: { id: pendingId },
    include: { list: true },
  });
  if (!pending) throw new Error("Not found");

  // Only list owner or admins can approve
  const isOwner = pending.list.ownerId === user.id;
  const membership = await db.listMember.findUnique({
    where: { userId_listId: { userId: user.id, listId: pending.listId } },
  });
  const isAdmin = membership?.role === "ADMIN";

  if (!isOwner && !isAdmin) throw new Error("Unauthorized");

  // Create the actual person
  await db.person.create({
    data: {
      firstName: pending.firstName,
      lastName: pending.lastName,
      motherName: pending.motherName,
      gender: pending.gender,
      status: pending.status,
      injuryDate: pending.injuryDate,
      notes: pending.notes,
      listId: pending.listId,
      addedById: pending.addedById,
    },
  });

  // Update pending status
  await db.pendingPerson.update({
    where: { id: pendingId },
    data: { moderationStatus: "APPROVED" },
  });

  revalidatePath(`/list/${pending.listId}`);
  revalidatePath(`/list/${pending.listId}/manage`);
}

export async function rejectPendingPerson(pendingId: string) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const pending = await db.pendingPerson.findUnique({
    where: { id: pendingId },
    include: { list: true },
  });
  if (!pending) throw new Error("Not found");

  const isOwner = pending.list.ownerId === user.id;
  const membership = await db.listMember.findUnique({
    where: { userId_listId: { userId: user.id, listId: pending.listId } },
  });
  const isAdmin = membership?.role === "ADMIN";

  if (!isOwner && !isAdmin) throw new Error("Unauthorized");

  await db.pendingPerson.update({
    where: { id: pendingId },
    data: { moderationStatus: "REJECTED" },
  });

  revalidatePath(`/list/${pending.listId}/manage`);
}

// ──────────────────────────────────────────
// MEMBER ACTIONS
// ──────────────────────────────────────────

export async function updateMemberRole(
  memberId: string,
  role: "VIEWER" | "CONTRIBUTOR" | "ADMIN"
) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const member = await db.listMember.findUnique({
    where: { id: memberId },
    include: { list: true },
  });
  if (!member) throw new Error("Not found");

  // Only list owner can change roles
  if (member.list.ownerId !== user.id) throw new Error("Unauthorized");

  await db.listMember.update({
    where: { id: memberId },
    data: { role },
  });

  revalidatePath(`/list/${member.listId}/manage`);
}

export async function removeMember(memberId: string) {
  const user = await getOrCreateDbUser();
  if (!user) throw new Error("Unauthorized");

  const member = await db.listMember.findUnique({
    where: { id: memberId },
    include: { list: true },
  });
  if (!member) throw new Error("Not found");

  // Only list owner can remove members
  if (member.list.ownerId !== user.id) throw new Error("Unauthorized");

  await db.listMember.delete({ where: { id: memberId } });

  revalidatePath(`/list/${member.listId}/manage`);
}

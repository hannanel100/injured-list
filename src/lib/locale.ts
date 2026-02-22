// ──────────────────────────────────────────
// Hebrew locale strings for the entire app
// ──────────────────────────────────────────

export const he = {
  // App
  appName: "רשימת תפילה",
  appDescription: "ניהול רשימות תפילה לרפואת חולים ופצועים",

  // Nav
  home: "דף הבית",
  dashboard: "הרשימות שלי",
  signIn: "התחברות",
  signUp: "הרשמה",
  signOut: "התנתקות",

  // List types
  personal: "אישי",
  community: "קהילתי",
  listTypePersonal: "רשימה אישית",
  listTypeCommunity: "רשימה קהילתית",

  // List
  createList: "יצירת רשימה חדשה",
  editList: "עריכת רשימה",
  deleteList: "מחיקת רשימה",
  listName: "שם הרשימה",
  listDescription: "תיאור",
  listType: "סוג רשימה",
  listSettings: "הגדרות רשימה",
  noLists: "אין רשימות עדיין",
  communityLists: "רשימות קהילתיות",
  myLists: "הרשימות שלי",
  joinList: "הצטרפות לרשימה",
  memberCount: "חברים",

  // Person
  addPerson: "הוספת שם לתפילה",
  editPerson: "עריכת פרטים",
  deletePerson: "הסרה מהרשימה",
  firstName: "שם פרטי",
  lastName: "שם משפחה",
  motherName: "שם האם",
  gender: "מין",
  male: "זכר",
  female: "נקבה",
  status: "מצב",
  injured: "פצוע/ה",
  sick: "חולה",
  recovering: "בהחלמה",
  healed: "החלים/ה",
  injuryDate: "תאריך פציעה/מחלה",
  notes: "הערות",
  prayerName: "שם לתפילה",
  noPeople: "אין שמות ברשימה",
  dateAdded: "תאריך הוספה",

  // Gender prefix for prayer name
  ben: "בן",
  bat: "בת",

  // Moderation
  pendingApproval: "ממתין לאישור",
  approve: "אישור",
  reject: "דחייה",
  moderationQueue: "תור אישורים",
  noPending: "אין בקשות ממתינות",

  // Members
  members: "חברים",
  manageMembers: "ניהול חברים",
  role: "תפקיד",
  viewer: "צופה",
  contributor: "תורם",
  admin: "מנהל",
  owner: "בעלים",
  removeFromList: "הסרה מהרשימה",

  // Actions
  save: "שמירה",
  cancel: "ביטול",
  delete: "מחיקה",
  edit: "עריכה",
  submit: "שליחה",
  back: "חזרה",
  confirm: "אישור",
  close: "סגירה",

  // Messages
  saved: "נשמר בהצלחה",
  deleted: "נמחק בהצלחה",
  error: "אירעה שגיאה",
  confirmDelete: "האם אתה בטוח שברצונך למחוק?",
  submittedForApproval: "נשלח לאישור בעל הרשימה",
  approved: "אושר בהצלחה",
  rejected: "נדחה",

  // Landing
  heroTitle: "רשימת תפילה לרפואת חולים ופצועים",
  heroSubtitle: "צור רשימות תפילה אישיות וקהילתיות, שתף עם אחרים והתפלל לרפואתם",
  getStarted: "התחל עכשיו",
  viewCommunityLists: "רשימות קהילתיות",

  // Misc
  loading: "טוען...",
  optional: "אופציונלי",
  required: "שדה חובה",
  manage: "ניהול",
} as const;

// Status display map
export const statusLabels: Record<string, string> = {
  INJURED: he.injured,
  SICK: he.sick,
  RECOVERING: he.recovering,
  HEALED: he.healed,
};

// Gender display map
export const genderLabels: Record<string, string> = {
  MALE: he.male,
  FEMALE: he.female,
};

// Role display map
export const roleLabels: Record<string, string> = {
  VIEWER: he.viewer,
  CONTRIBUTOR: he.contributor,
  ADMIN: he.admin,
};

// List type display map
export const listTypeLabels: Record<string, string> = {
  PERSONAL: he.listTypePersonal,
  COMMUNITY: he.listTypeCommunity,
};

/**
 * Generate the Hebrew prayer name format.
 * Male: שלמה בן רחל
 * Female: שרה בת רחל
 */
export function formatPrayerName(
  firstName: string,
  motherName: string,
  gender: "MALE" | "FEMALE"
): string {
  const prefix = gender === "MALE" ? he.ben : he.bat;
  return `${firstName} ${prefix} ${motherName}`;
}

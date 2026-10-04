// Admin access — sirf ye emails admin panel khol sakte hain.
// Firestore rules (firestore.rules) me bhi yahi email allow hai.
export const ADMIN_EMAILS = ['as7652084085@gmail.com'];

export function isAdminEmail(email) {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

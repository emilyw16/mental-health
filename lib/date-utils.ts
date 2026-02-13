/**
 * Get today's date in YYYY-MM-DD format using the device's local timezone.
 * Use this instead of toISOString().split('T')[0] which uses UTC and can
 * show the wrong date (e.g. 2/8 when it's 2/9 locally).
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

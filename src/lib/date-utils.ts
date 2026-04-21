/**
 * Extract date from video_datetime string (Format: YYYY-MM-DD HH:mm:ss)
 * @param video_datetime 
 * @returns YYYY-MM-DD
 */
export function getVideoDate(video_datetime: string): string {
  if (!video_datetime) return "";
  const datePart = video_datetime.split("T")[0];
  if (!datePart) return "";
  const [year, month, day] = datePart.split("-");
  return `${day}-${month}-${year}`;
}

/**
 * Extract time from video_datetime string (Format: YYYY-MM-DD HH:mm:ss)
 * @param video_datetime 
 * @returns HH:mm:ss
 */
export function getVideoTime(video_datetime: string): string {
  if (!video_datetime) return "";
  return video_datetime.split("T")[1] || "";
}

/**
 * Convert ISO datetime string to "HH:mm:ss DD-MM-YYYY"
 * @param video_datetime ISO string, e.g. "2026-03-28T11:35:36"
 * @returns formatted string, e.g. "11:35:36 28-03-2026"
 */
export function formatVideoDateTime(video_datetime: string): string {
  if (!video_datetime) return "";

  // Pisahkan tanggal dan waktu
  const [datePart, timePart] = video_datetime.split("T");
  if (!datePart || !timePart) return "";

  // Pisahkan tanggal menjadi YYYY, MM, DD
  const [year, month, day] = datePart.split("-");

  // Format menjadi "HH:mm:ss DD-MM-YYYY"
  return `${timePart} ${day}-${month}-${year}`;
}

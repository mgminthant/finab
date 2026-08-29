export function getYangonDate() {
  const parts = new Date().toLocaleString("en-CA", {
    timeZone: "Asia/Yangon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month, day] = parts.split("-").map(Number);
  return { year, month, day };
}

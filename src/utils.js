export function cleanDate(rawDate) {
  if (rawDate instanceof Date) {
    return rawDate;
  }
  if (typeof rawDate === "string") {
    const parsedDate = Date.parse(rawDate);

    if (isNaN(parsedDate)) return undefined;

    return new Date();
  }

  return undefined;
}

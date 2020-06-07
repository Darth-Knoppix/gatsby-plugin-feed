export function cleanDate(rawDate) {
  if (rawDate instanceof Date) {
    return rawDate;
  }
  if (typeof rawDate === "string") {
    const dateParts = rawDate.split(/\D+/);

    return new Date(
      Date.UTC(
        dateParts[0],
        --dateParts[1],
        dateParts[2],
        dateParts[3],
        dateParts[4],
        dateParts[5],
        dateParts[6]
      )
    );
  }

  return undefined;
}

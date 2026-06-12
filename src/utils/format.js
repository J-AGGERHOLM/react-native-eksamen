// Formats a number as US currency.
export function formatMoney(amount) {
  // Converts amount to number and formats it with a dollar sign.
  return `$${Number(amount).toLocaleString("en-US")}`;
}

// Converts different date formats into a JavaScript Date object.
function getDateFromValue(value) {
  // Returns null if no value is provided.
  if (!value) {
    return null;
  }

  // Converts Firestore Timestamp object with seconds.
  if (value.seconds) {
    return new Date(value.seconds * 1000);
  }

  // Converts Firestore Timestamp using its toDate method.
  if (value.toDate) {
    return value.toDate();
  }

  // Converts normal Date values or date strings.
  return new Date(value);
}

// Formats a date for display.
export function formatDate(value) {
  // Converts the value into a JavaScript Date.
  const date = getDateFromValue(value);

  // Returns empty text if the date is invalid.
  if (!date || isNaN(date.getTime())) {
    return "";
  }

  // Returns a short English date format.
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Formats a time for display.
export function formatTime(value) {
  // Converts the value into a JavaScript Date.
  const date = getDateFromValue(value);

  // Returns empty text if the time is invalid.
  if (!date || isNaN(date.getTime())) {
    return "";
  }

  // Returns an English time format with "at" in front.
  return `at ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
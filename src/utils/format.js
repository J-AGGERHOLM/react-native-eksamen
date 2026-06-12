export function formatMoney(amount) {
  return `$${Number(amount).toLocaleString("en-US")}`;
}

function getDateFromValue(value) {
  if (!value) {
    return null;
  }

  if (value.seconds) {
    return new Date(value.seconds * 1000);
  }

  if (value.toDate) {
    return value.toDate();
  }

  return new Date(value);
}

export function formatDate(value) {
  const date = getDateFromValue(value);

  if (!date || isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(value) {
  const date = getDateFromValue(value);

  if (!date || isNaN(date.getTime())) {
    return "";
  }

  return `at ${date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
}
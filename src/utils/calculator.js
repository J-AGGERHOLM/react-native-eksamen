// Calculates how much of the target has been reached in percent.
export function CalculatePercentage(target, totalPaid) {
  // Converts the target value to a number.
  const targetNumber = Number(target);
  // Converts the paid amount to a number.
  const totalPaidNumber = Number(totalPaid);

  // Avoids division by zero or negative targets.
  if (targetNumber <= 0) {
    return 0;
  }

  // Calculates the percentage progress.
  const percentage = Math.round((totalPaidNumber / targetNumber) * 100);

  // Prevents the percentage from going above 100.
  return Math.min(percentage, 100);
}

// Calculates how much money is still missing.
export function CalculateAmountLeft(target, totalPaid) {
  // Converts the target value to a number.
  const targetNumber = Number(target);
  // Converts the paid amount to a number.
  const totalPaidNumber = Number(totalPaid);

  // Converts the paid amount to a number.
  return Math.max(targetNumber - totalPaidNumber, 0);
}

// Calculates saving projections based on fixed weekly amounts.
export function CalculateProjections(target, totalPaid) {
  // Calculates how much money is still missing.
  const amountLeft = CalculateAmountLeft(target, totalPaid);

  // Defines the weekly saving options.
  const weeklyAmounts = [50, 100, 200];

  // Creates one projection for each weekly saving amount.
  return weeklyAmounts.map((weeklyAmount) => {
    // Calculates how many weeks are needed.
    const weeksNeeded = Math.ceil(amountLeft / weeklyAmount);
    // Calculates the estimated completion date.
    const completionDate = calculateCompletionDate(weeksNeeded);

    // Returns the projection object used in the UI.
    return {
      id: weeklyAmount.toString(),
      title: `Save ${formatMoney(weeklyAmount)}/week`,
      weeks: `${weeksNeeded} ${weeksNeeded === 1 ? "week" : "weeks"}`,
      date: formatDate(completionDate),
    };
  });
}

// Calculates a future date based on number of weeks.
function calculateCompletionDate(weeksNeeded) {
  // Creates a date starting from today.
  const completionDate = new Date();

  // Adds the required number of weeks.
  completionDate.setDate(completionDate.getDate() + weeksNeeded * 7);

  // Returns the calculated date.
  return completionDate;
}

// Formats a number as money.
function formatMoney(amount) {
  // Converts amount to number and formats it with a dollar sign.
  return `$${Number(amount).toLocaleString()}`;
}

// Formats a date for display.
function formatDate(dateValue) {
  // Converts the value to a JavaScript Date.
  const date = new Date(dateValue);

  // Returns a short formatted date.
  return date.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Calculates the total paid amount from transactions.
export function CalculateTotalPaid(transactions = []) {
  // Sums the amount from each transaction. if transactions is empty, returns 0.
  return transactions.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);
}
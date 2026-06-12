export function CalculatePercentage(target, totalPaid) {
  const targetNumber = Number(target);
  const totalPaidNumber = Number(totalPaid);

  if (targetNumber <= 0) {
    return 0;
  }

  const percentage = Math.round((totalPaidNumber / targetNumber) * 100);

  return Math.min(percentage, 100);
}

export function CalculateAmountLeft(target, totalPaid) {
  const targetNumber = Number(target);
  const totalPaidNumber = Number(totalPaid);

  return Math.max(targetNumber - totalPaidNumber, 0);
}

export function CalculateProjections(target, totalPaid) {
  const amountLeft = CalculateAmountLeft(target, totalPaid);

  const weeklyAmounts = [50, 100, 200];

  return weeklyAmounts.map((weeklyAmount) => {
    const weeksNeeded = Math.ceil(amountLeft / weeklyAmount);
    const completionDate = calculateCompletionDate(weeksNeeded);

    return {
      id: weeklyAmount.toString(),
      title: `Save ${formatMoney(weeklyAmount)}/week`,
      weeks: `${weeksNeeded} ${weeksNeeded === 1 ? "week" : "weeks"}`,
      date: formatDate(completionDate),
    };
  });
}

function calculateCompletionDate(weeksNeeded) {
  const completionDate = new Date();

  completionDate.setDate(completionDate.getDate() + weeksNeeded * 7);

  return completionDate;
}

function formatMoney(amount) {
  return `$${Number(amount).toLocaleString()}`;
}

function formatDate(dateValue) {
  const date = new Date(dateValue);

  return date.toLocaleDateString("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CalculateTotalPaid(transactions = []) {
  return transactions.reduce((total, transaction) => {
    return total + Number(transaction.amount);
  }, 0);
}
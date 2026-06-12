import { CalculateAmountLeft } from "./calculateRemainingSum";

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
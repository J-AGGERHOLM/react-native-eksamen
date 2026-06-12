function calculateProjections(goal) {
  const amountLeft = calculateAmountLeft(goal);

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
export default function allocateWeeks(users) {
  const allWeeks = [];
  Object.values(users).forEach(user => {
    allWeeks.push(...user.weeks);
  });

  const seen = new Set();
  const uniqueWeeks = allWeeks.filter(week => {
    if (!seen.has(week.id)) {
      seen.add(week.id);
      return true;
    }
    return false;
  });

  const sortedUsers = Object.entries(users).sort((a, b) => b[1].priority - a[1].priority);

  const allocated = {};
  const takenWeeks = new Set();

  sortedUsers.forEach(([userId, user]) => {
    allocated[userId] = { allocations: [], totalValue: 0 };
    const availableWeeks = user.weeks.filter(w => !takenWeeks.has(w.id));

    let selectedWeeks = [];

    for (let i = 0; i < availableWeeks.length; i++) {
      const chosen = [availableWeeks[i]];
      for (let j = i + 1; j < availableWeeks.length && chosen.length < 3; j++) {
        if (Math.abs(availableWeeks[j].id - chosen[chosen.length - 1].id) >= 4) {
          chosen.push(availableWeeks[j]);
        }
      }
      if (chosen.length === 3) {
        selectedWeeks = chosen;
        break;
      }
    }

    if (selectedWeeks.length === 0) {
      selectedWeeks = availableWeeks.slice(0, 3);
    }

    selectedWeeks.forEach(week => {
      takenWeeks.add(week.id);
      allocated[userId].allocations.push(week);
      allocated[userId].totalValue += week.value;
    });
  });

  while (Object.values(allocated).some(data => data.allocations.length < 6)) {
    Object.entries(allocated)
    .sort((a, b) => a[1].allocations.length - b[1].allocations.length)
    .forEach(([userId, data]) => {
      if (data.allocations.length < 6) {
        const availableWeeks = users[userId].weeks
        .filter(w => !takenWeeks.has(w.id))
        .sort((a, b) => b.value - a.value);

        if (availableWeeks.length > 0) {
          const week = availableWeeks[0];
          takenWeeks.add(week.id);
          data.allocations.push(week);
          data.totalValue += week.value;
        }
      }
    });
  }

  const allAllocatedWeekIds = new Set(
    Object.values(allocated)
    .flatMap(user => user.allocations.map(w => w.id))
  );

  const unallocatedWeeks = uniqueWeeks.filter(w => !allAllocatedWeekIds.has(w.id));

  return {
    allocated,
    unallocated: unallocatedWeeks
  };
}

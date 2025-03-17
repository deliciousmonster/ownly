export default function allocateWeeks(users) {
  const allWeeks = [];
  Object.values(users).forEach(user => {
    allWeeks.push(...user.weeks);
  });

  // Remove duplicates while preserving order
  const seen = new Set();
  const uniqueWeeks = allWeeks.filter(week => {
    if (!seen.has(week.id)) {
      seen.add(week.id);
      return true;
    }
    return false;
  });

  // Sort users by block settings first, then priority
  const sortedUsers = Object.entries(users).sort((a, b) => {
    if (b[1].blocks === a[1].blocks) {
      return b[1].priority - a[1].priority;
    }
    return b[1].blocks - a[1].blocks;
  });

  const allocated = {};
  const takenWeeks = new Set();

  sortedUsers.forEach(([userId, user]) => {
    allocated[userId] = { allocations: [], totalValue: 0 };
    const availableWeeks = user.weeks.filter(w => !takenWeeks.has(w.id));

    let count = user.blocks === 3 ? 1 : user.blocks === 2 ? 2 : 3;
    const selectedWeeks = availableWeeks.slice(0, count);

    selectedWeeks.forEach(week => {
      takenWeeks.add(week.id);
      allocated[userId].allocations.push(week);
      allocated[userId].totalValue += week.value;
    });
  });

  // Second pass to allocate remaining weeks
  while (Object.values(allocated).some(data => data.allocations.length < 3)) {
    Object.entries(allocated).sort((a, b) => a[1].allocations.length - b[1].allocations.length)
    .forEach(([userId, data]) => {
      if (data.allocations.length < 3) {
        const availableWeeks = users[userId].weeks.filter(w => !takenWeeks.has(w.id));
        if (availableWeeks.length > 0) {
          const week = availableWeeks[0];
          takenWeeks.add(week.id);
          data.allocations.push(week);
          data.totalValue += week.value;
        }
      }
    });
  }

  // Final pass ignoring block constraints for unallocated users
  Object.entries(allocated).forEach(([userId, data]) => {
    const remainingNeeded = 3 - data.allocations.length;
    const availableWeeks = uniqueWeeks.filter(w => !takenWeeks.has(w.id)).slice(0, remainingNeeded);

    availableWeeks.forEach(week => {
      takenWeeks.add(week.id);
      data.allocations.push(week);
      data.totalValue += week.value;
    });
  });

  return allocated;
}

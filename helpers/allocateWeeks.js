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

    let selectedWeeks = [];

    if (user.blocks === 6) {
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
    } else if (user.blocks === 3) {
      for (let i = 0; i < availableWeeks.length - 1; i++) {
        const pairs = [[availableWeeks[i], availableWeeks[i + 1]]];
        let lastEnd = availableWeeks[i + 1].id;
        for (let j = i + 2; j < availableWeeks.length - 1 && pairs.length < 3; j++) {
          if (availableWeeks[j].id - lastEnd >= 6 && availableWeeks[j + 1].id === availableWeeks[j].id + 1) {
            pairs.push([availableWeeks[j], availableWeeks[j + 1]]);
            lastEnd = availableWeeks[j + 1].id;
          }
        }
        if (pairs.length === 3) {
          selectedWeeks = pairs.flat();
          break;
        }
      }
    } else if (user.blocks === 2) {
      for (let i = 0; i < availableWeeks.length - 2; i++) {
        const groups = [[availableWeeks[i], availableWeeks[i + 1], availableWeeks[i + 2]]];
        let lastEnd = availableWeeks[i + 2].id;
        for (let j = i + 3; j < availableWeeks.length - 2 && groups.length < 2; j++) {
          if (availableWeeks[j].id - lastEnd >= 8 &&
            availableWeeks[j + 1].id === availableWeeks[j].id + 1 &&
            availableWeeks[j + 2].id === availableWeeks[j].id + 2) {
            groups.push([availableWeeks[j], availableWeeks[j + 1], availableWeeks[j + 2]]);
            lastEnd = availableWeeks[j + 2].id;
          }
        }
        if (groups.length === 2) {
          selectedWeeks = groups.flat();
          break;
        }
      }
    } else if (user.blocks === 1) {
      for (let i = 0; i < availableWeeks.length - 5; i++) {
        let valid = true;
        for (let j = 0; j < 5; j++) {
          if (availableWeeks[i + j + 1].id !== availableWeeks[i + j].id + 1) {
            valid = false;
            break;
          }
        }
        if (valid) {
          selectedWeeks = availableWeeks.slice(i, i + 6);
          break;
        }
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

  // Repeatedly balance totalValue to be within 10% of 172
  const target = 172;
  const allowedDiff = target * 0.1;
  let maxPasses = 10;
  let pass = 0;

  while (pass < maxPasses) {
    const usersArray = Object.entries(allocated).sort((a, b) => b[1].totalValue - a[1].totalValue);
    const maxValue = usersArray[0][1].totalValue;
    const minValue = usersArray[usersArray.length - 1][1].totalValue;

    if (Math.abs(maxValue - target) <= allowedDiff && Math.abs(minValue - target) <= allowedDiff) {
      break;
    }

    for (let i = 0; i < usersArray.length - 1; i++) {
      const [highUserId, highUser] = usersArray[i];
      const [lowUserId, lowUser] = usersArray[usersArray.length - 1 - i];

      for (let hi = 0; hi < highUser.allocations.length; hi++) {
        for (let lo = 0; lo < lowUser.allocations.length; lo++) {
          const hiWeek = highUser.allocations[hi];
          const loWeek = lowUser.allocations[lo];

          if (hiWeek.value > loWeek.value) {
            const diff = hiWeek.value - loWeek.value;
            const newHigh = highUser.totalValue - diff;
            const newLow = lowUser.totalValue + diff;

            if (Math.abs(newHigh - target) <= allowedDiff && Math.abs(newLow - target) <= allowedDiff) {
              [highUser.allocations[hi], lowUser.allocations[lo]] = [loWeek, hiWeek];
              highUser.totalValue = newHigh;
              lowUser.totalValue = newLow;
            }
          }
        }
      }
    }

    pass++;
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

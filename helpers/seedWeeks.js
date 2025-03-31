import { format, addWeeks, add } from 'date-fns';
const { Weeks } = tables;

const seedWeeks = [{
  value: 36,
  id: 1,
  description: 'New Year’s Recovery',
  start: null
},
  {
    value: 35,
    id: 2,
    description: 'High Season Start',
    start: null
  },
  {
    value: 44,
    id: 3,
    description: 'Whale Watching Season Peak 1',
    start: null
  },
  {
    value: 43,
    id: 4,
    description: 'Whale Watching Season Peak 2',
    start: null
  },
  {
    value: 42,
    id: 5,
    description: 'Whale Watching Season Peak 3',
    start: null
  },
  {
    value: 41,
    id: 6,
    description: 'Whale Watching Season Peak 4',
    start: null
  },
  {
    value: 40,
    id: 7,
    description: 'Whale Watching Season Peak 5',
    start: null
  },
  {
    value: 39,
    id: 8,
    description: 'Whale Watching Season Peak 6',
    start: null
  },
  {
    value: 38,
    id: 9,
    description: 'Whale Watching Season Peak 7',
    start: null
  },
  {
    value: 37,
    id: 10,
    description: 'Whale Watching Season Peak 8',
    start: null
  },
  {
    value: 34,
    id: 11,
    description: 'Spring Break 1',
    start: null
  },
  {
    value: 33,
    id: 12,
    description: 'Spring Break 2',
    start: null
  },
  {
    value: 50,
    id: 13,
    description: 'Semana Santa / Easter 1',
    start: null
  },
  {
    value: 49,
    id: 14,
    description: 'Semana Santa / Easter 2',
    start: null
  },
  {
    value: 22,
    id: 15,
    description: 'Peak Season 1',
    start: null
  },
  {
    value: 21,
    id: 16,
    description: 'Peak Season 2',
    start: null
  },
  {
    value: 20,
    id: 17,
    description: 'Peak Season 3',
    start: null
  },
  {
    value: 19,
    id: 18,
    description: 'Peak Season 4',
    start: null
  },
  {
    value: 18,
    id: 19,
    description: 'Peak Season 5',
    start: null
  },
  {
    value: 17,
    id: 20,
    description: 'Peak Season 6',
    start: null
  },
  {
    value: 16,
    id: 21,
    description: 'Peak Season 7',
    start: null
  },
  {
    value: 15,
    id: 22,
    description: 'Peak Season 8',
    start: null
  },
  {
    value: 14,
    id: 23,
    description: 'Peak Season 9',
    start: null
  },
  {
    value: 13,
    id: 24,
    description: 'Peak Season 10',
    start: null
  },
  {
    value: 24,
    id: 25,
    description: 'Peak Season 11',
    start: null
  },
  {
    value: 23,
    id: 26,
    description: 'Peak Season 12',
    start: null
  },
  {
    value: 12,
    id: 27,
    description: 'Hottest Summer Weeks 1',
    start: null
  },
  {
    value: 11,
    id: 28,
    description: 'Hottest Summer Weeks 2',
    start: null
  },
  {
    value: 10,
    id: 29,
    description: 'Hottest Summer Weeks 3',
    start: null
  },
  {
    value: 9,
    id: 30,
    description: 'Hottest Summer Weeks 4',
    start: null
  },
  {
    value: 8,
    id: 31,
    description: 'Hottest Summer Weeks 5',
    start: null
  },
  {
    value: 7,
    id: 32,
    description: 'Hottest Summer Weeks 6',
    start: null
  },
  {
    value: 6,
    id: 33,
    description: 'Hottest Summer Weeks 7',
    start: null
  },
  {
    value: 5,
    id: 34,
    description: 'Hottest Summer Weeks 6',
    start: null
  },
  {
    value: 4,
    id: 35,
    description: 'Labor Day Weekend 1',
    start: null
  },
  {
    value: 3,
    id: 36,
    description: 'Labor Day Weekend 2',
    start: null
  },
  {
    value: 2,
    id: 37,
    description: 'October Shoulder Season',
    start: null
  },
  {
    value: 1,
    id: 38,
    description: 'October Shoulder Season',
    start: null
  },
  {
    value: 30,
    id: 39,
    description: 'Whale Shark & Diving Peak Season 1',
    start: null
  },
  {
    value: 29,
    id: 40,
    description: 'Whale Shark & Diving Peak Season 2',
    start: null
  },
  {
    value: 28,
    id: 41,
    description: 'Whale Shark & Diving Peak Season 3',
    start: null
  },
  {
    value: 27,
    id: 42,
    description: 'Whale Shark & Diving Peak Season 4',
    start: null
  },
  {
    value: 26,
    id: 43,
    description: 'Whale Shark & Diving Peak Season 5',
    start: null
  },
  {
    value: 25,
    id: 44,
    description: 'Whale Shark & Diving Peak Season 6',
    start: null
  },
  {
    value: 32,
    id: 45,
    description: 'Baja 1000 Race',
    start: null
  },
  {
    value: 31,
    id: 46,
    description: 'Los Cabos Film Festival',
    start: null
  },
  {
    value: 48,
    id: 47,
    description: 'Thanksgiving Week 1',
    start: null
  },
  {
    value: 47,
    id: 48,
    description: 'Thanksgiving Week 2',
    start: null
  },
  {
    value: 46,
    id: 49,
    description: 'Post-Thanksgiving',
    start: null
  },
  {
    value: 45,
    id: 50,
    description: 'Early December',
    start: null
  },
  {
    value: 51,
    id: 51,
    description: 'Christmas',
    start: 'Dec 20',
    end: ' Dec 27'
  },
  {
    value: 52,
    id: 52,
    description: 'New Year’s Eve',
    start: 'Dec 27',
    end: 'Jan 03'
  }
]

const firstDay = 2;
/**
 * Get the first Saturday after Jan 2nd for the given year
 * @param {number} year
 * @returns {Date}
 */
function getFirstSaturdayInJan(year) {
  const day1 = new Date(year, 0, firstDay); // Jan is 0-indexed
  const dayOfWeek = day1.getDay(); // Sunday = 0, Saturday = 6

  // Days to next Saturday
  const daysToSaturday = (6 - dayOfWeek + 7) % 7 || 7;

  return new Date(year, 0, firstDay + daysToSaturday);
}

/**
 * Generate the first 50 weeks starting from the first Saturday after Jan 2nd
 * @param {number} year
 * @returns {Date[]} Array of Saturdays
 */
function generateFirst50Weeks(year) {
  const startSaturday = getFirstSaturdayInJan(year);
  const weeks = [];

  for (let i = 0; i < 52; i++) {
    const weekStart = addWeeks(startSaturday, i);
    weeks.push(weekStart);
  }

  return weeks;
}

const getCalendarForYear = (year = 2026) => {
  const weeks = generateFirst50Weeks(year);
  weeks.forEach((week, i) => {
    if(i < 50) {
      seedWeeks[i].start = format(week, 'MMM dd');
      seedWeeks[i].end = format(add(week, { days: 7 }), 'MMM dd');
    }
  });
  return seedWeeks.forEach((w) => Weeks.put(w));
}

const currentYear = new Date().getFullYear();
export default () => getCalendarForYear(currentYear + 1);

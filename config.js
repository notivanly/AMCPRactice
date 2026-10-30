/* Site-wide settings. Edit this file to rename the site or update contest dates. */
const CONFIG = {
  siteName: 'AMC Arena',
  tagline: 'Practice for the AMC 8, 10 and 12',

  // Official 2026–27 dates (check https://www.maa.org/AMC for changes).
  contests: [
    { name: 'AMC 10/12 A', date: '2026-11-05', levels: [10, 12] },
    { name: 'AMC 10/12 B', date: '2026-11-13', levels: [10, 12] },
    { name: 'AMC 8',       date: '2027-01-21', levels: [8], note: 'Testing window runs Jan 21–27, 2027' }
  ],

  exam: {
    8:  { name: 'AMC 8',  questions: 25, minutes: 40, correct: 1, blank: 0,   max: 25,  grade: 'Grade 8 and below' },
    10: { name: 'AMC 10', questions: 25, minutes: 75, correct: 6, blank: 1.5, max: 150, grade: 'Grade 10 and below, under 17.5 years old' },
    12: { name: 'AMC 12', questions: 25, minutes: 75, correct: 6, blank: 1.5, max: 150, grade: 'Grade 12 and below, under 19.5 years old' }
  },

  cats: {
    alg: { name: 'Algebra',               blurb: 'Equations, functions, sequences, logarithms, complex numbers' },
    geo: { name: 'Geometry',              blurb: 'Triangles, circles, coordinates, trigonometry, solids' },
    nt:  { name: 'Number theory',         blurb: 'Divisors, primes, modular arithmetic, digits' },
    cp:  { name: 'Counting & probability', blurb: 'Arrangements, combinations, probability, expected value' }
  }
};

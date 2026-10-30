# AMC Arena

A free, static practice site for the **AMC 8, AMC 10 and AMC 12**. No build step, no server, no accounts.

**What's inside**

- **Mock tests**: full 25-question tests (or shorter), timed like the real exam, with a bubble-style answer sheet, flagging, cross-out, official scoring (AMC 8: 1 point each; AMC 10/12: 6 / 1.5 / 0), and a review of every question afterwards.
- **Practice by topic**: 133 original AMC-style problems across Algebra, Geometry, Number theory and Counting & probability, filterable by contest, difficulty, status and search. Two tries per problem, a hint, and a worked solution.
- **Drills**: endless fresh questions from 22 generators, each with a worked solution.
- **Review**: missed and starred problems collect automatically.
- **Progress**: accuracy by topic, contest and difficulty, weakest topics, mock-test trend, practice calendar, daily streak and goal.
- **Resources**: contest facts and dates, a "should I guess?" calculator, a formula sheet, study tips, links to real past exams.
- Light and dark themes, phone-friendly layout, keyboard shortcuts, backup and restore of your progress.

## Put it on GitHub Pages

1. Create a new repository on GitHub (public).
2. Upload everything in this folder to it, **including the hidden `.nojekyll` file** (or use `git init`, `git add .`, `git commit`, `git push`).
3. In the repository go to **Settings, then Pages**. Under *Build and deployment* choose **Deploy from a branch**, pick `main` and `/ (root)`, and save.
4. After a minute your site is live at `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

To try it on your computer first, open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

Math is drawn by [KaTeX](https://katex.org), loaded from a CDN, so the page needs an internet connection the first time. Fonts come from Google Fonts and fall back to system fonts.

## Customize

- **Name, contest dates, exam rules**: `js/config.js`. Dates are the official 2026-27 dates; confirm at https://www.maa.org/AMC.
- **Colors and fonts**: the variables at the top of `css/style.css`.
- **Add or edit problems**: see `tools/README.md`. The builder checks every answer key by computer.

## Notes

- Progress is saved in the visitor's own browser (localStorage). Nothing is sent anywhere. Use *Settings, Export backup* to move it between devices.
- All problems and solutions are original. This is an unofficial practice site, not affiliated with or endorsed by the Mathematical Association of America; "AMC" is their trademark. For real past exams use the links on the Resources page.
- Reported AIME cutoffs for 2026-27 (100 on the AMC 10, 85 on the AMC 12) come from secondary sources; check the MAA before relying on them.

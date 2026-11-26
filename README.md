# Lab 8 – Smart Campus Analytics Dashboard (React)

An interactive dashboard that analyses student attendance, academic performance and
assignment completion from a predefined JSON dataset. No backend is used: the data
lives in `public/students.json` and is loaded in the browser.

## Run

```bash
npm install
npm run dev      # development server (http://localhost:5173)
npm run build    # production build in dist/
```

## Tech stack

- React 19 + Vite
- Tailwind CSS v4 + shadcn/ui (Radix primitives) for the UI components
- Recharts (through the shadcn `Chart` wrapper) for the bar, pie and line charts
- lucide-react icons, Geist font, light/dark theme

## Project structure

```
public/students.json          predefined dataset (26 students)
src/
  App.jsx                     loads JSON (useEffect), holds state, filters and sorts
  utils/analytics.js          statistics helpers (map / filter / reduce / sort)
  components/
    ui/                       shadcn/ui primitives (card, table, sheet, select, chart, ...)
    SummaryCard.jsx           reusable stat card
    SummaryCards.jsx          dashboard cards: total, avg attendance, avg marks, assignments, at-risk
    Filters.jsx               search box and class / status / risk filters
    StudentTable.jsx          sortable student records table
    StudentDetails.jsx        side drawer with full details of a selected student
    RiskBadge, StatusBadge, StudentAvatar, ProgressBar, Toggle, ThemeToggle   small reusable components
    Charts.jsx                bar, pie and line charts
    Leaderboard.jsx           additional feature: performance leaderboard
screenshots/                  screenshots of the running dashboard
```

## Dataset

Each record in `students.json` has:

| Field | Example |
|---|---|
| `id`, `name`, `email` | `SC2026001`, `Aarav Mehta` |
| `class` | `FYMCA`, `SYMCA` |
| `attendance` | `91` (percentage) |
| `marks` | marks out of 100 for Web Technology, DBMS, Data Structures, Software Engineering and Mathematics |
| `assignments` | `{ "completed": 10, "total": 10 }` |
| `status` | `Active`, `Probation`, `On Leave`, `Inactive` |

## Implemented features

1. **Dashboard summary.** Cards show total students, average attendance, average marks,
   average assignment completion and the at-risk count. Every value is calculated
   with `reduce()` from the records currently visible, so the cards update when filters change.
2. **Student records.** A table lists ID, name, class, attendance, average marks,
   assignments, status and risk. Click any column header to sort it ascending or descending.
   At-risk rows are tinted, and values below the thresholds are shown in red.
3. **Search and filtering.** Search by name or ID, and filter by class, status and
   risk (All, At Risk or Safe). A Reset button clears all filters.
4. **Data visualisation (Recharts).**
   - *Bar chart:* average marks for each subject. Bars below 40% turn red, and a dashed line marks the pass mark.
   - *Pie chart:* the distribution of students by Risk, Grade or Status, chosen with a toggle.
   - *Line chart:* attendance, average marks and assignment completion, either per student or per class (toggle).
     Dashed reference lines mark the 75% attendance and 40% marks thresholds.
5. **At-risk identification.** A student is at risk if attendance is below 75% **or**
   average marks are below 40% (`riskReasons()` in `analytics.js`). The reasons are listed in the details view.
6. **Student details.** Clicking a table row or a leaderboard entry opens a side drawer.
   It shows contact information, attendance, average, grade and status; subject-wise marks with progress bars;
   the strongest and weakest subjects; and assignment progress. Close it with ✕, by clicking outside the drawer, or with Esc (handled by the shadcn Sheet).
7. **Additional feature: performance leaderboard.** It ranks the top 5 or top 10 students
   by Marks, Attendance or Assignment completion, and it follows the active filters.
   For example, it can show the top students of one class.

## React concepts used

- **Functional and reusable components:** `SummaryCard`, `ChartCard` (in `Charts.jsx`), `Toggle`, `ProgressBar` and `RiskBadge`.
- **Props:** data and callbacks go from `App` to its children (`students`, `onSelect`, `onSort`, `onChange`).
- **useState:** used for filters, sort order, the selected student, chart toggles and the leaderboard metric.
- **useEffect:** fetches `students.json` on mount and applies the light/dark theme class.
- **useMemo:** caches the filtered and sorted list and the summary.
- **Event handling and conditional rendering:** loading and error states, empty results, the drawer and the risk badges.
- **Array methods:** `map()` renders rows, `filter()` applies search and filters, `reduce()` computes statistics, and `sort()` orders the table and leaderboard.

All statistics and charts are computed from the JSON data. None of the values are hardcoded.

## Screenshots

| | |
|---|---|
| Dashboard | `screenshots/01-dashboard.png` |
| Search ("an") | `screenshots/02-search.png` |
| At-risk filter, sorted by marks, grade pie | `screenshots/03-at-risk-filter-sorted.png` |
| Student details drawer | `screenshots/04-student-details.png` |
| Class-wise line chart, status pie, attendance leaderboard | `screenshots/05-class-view-leaderboard.png` |
# SE-ISE

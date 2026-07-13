# Personal planning and tracking app

## What this is
A personal all-in-one planning and tracking app for people who like to store and work on ideas, thoughts, lists, and daily reflections. Not a generic to-do app — the differentiator is having every kind of personal list/journal/tracker in one place, organized into user-defined categories, with a warm, encouraging feel rather than a purely productivity-tool feel.

Tagline direction: "A place for everything, and everything in its place."

Building order: **desktop web app first**, then wrap for mobile later (see Tech stack). Long-term target platform is mobile.

## Core concept
- Home screen greets the user ("welcome back") with a quote of the day.
- Next screen shows an affirmation banner at the top, followed by a scrollable list of categories.
- Each category is a self-contained space the user creates and names themselves.
- Every category is one of three types, chosen when the category is created:
  1. **Checklist** — to-do style, checkable items, done count.
  2. **Notes** — free-form text, no structure (good for quick ideas, quotes, gift ideas, love/dislike lists).
  3. **Journal** — dotted/ruled page style for reflective daily writing (good for "how was today," TBR notes, journaling).
- Users can add items to a category via text, voice, or photo.
- A stats/gallery screen shows completed items, monthly/yearly progress, and a streak counter.
- Small delight touches planned for later: confetti on completing personal wins, a tiny plant that grows or a small animal/fairy companion, encouraging notes when items are completed.

## Example categories (from initial brainstorm — not all required for v1)
Quick ideas (Insta), quotes that inspired you, to-do list, things to work on, things to finish, things I can do for better reach, streak tracker, ways to improve, things to do for fun, bucket of wishes, places to see, TBR (to-be-read) record, rolodex (people met / should contact), gift ideas, small love/dislike list, Amazon list, grocery list, "how was today" journal.

These map onto the three category types above rather than needing custom screens each — e.g. to-do/grocery/Amazon list = checklist type, quick ideas/quotes/gift ideas = notes type, TBR/how-was-today = journal type.

## v1 scope (agreed)
Ship these 3–4 categories to start, with category creation being fully user-driven (not hardcoded) from day one:
- To-do (checklist)
- Quick ideas (notes)
- Quotes (notes)
- TBR list (journal)

Users can rename, and can add their own custom categories, choosing a type (checklist / notes / journal) at creation time.

## Screens

### 1. Landing
- "Welcome back" heading.
- Quote of the day (static for v1 — daily rotation is a planned later feature, not required now).
- Continue action into the app.

### 2. Home
- Affirmation banner at the top (static for v1; later this should ideally change daily and can be pulled from the user's own saved quotes/notes list rather than a generic source).
- Scrollable vertical list of categories, each showing name + a type icon.
- "Add category (custom)" row at the end of the list — opens a small form: name input + type picker (checklist / notes / journal).

### 3. Category detail
Rendering depends on category type:
- **Checklist**: rows with checkboxes, strikethrough on completion, a "done: N" counter, an encouraging note on completion.
- **Notes**: a simple free-text area, no structure.
- **Journal**: a dotted/ruled page look, free text per "page" or entry.
- An "add item" action (bottom sheet) offering three input methods: type, voice, photo.

### 4. Stats / gallery
- Streak counter.
- Month/year progress (e.g. percentage of tasks completed).
- List/gallery of completed items across categories.

## Design aesthetic (from initial notes)
- Palette: peach, sky blue, orange, brown (for accent text/font).
- Motifs: orchids, lemons, hearts, smiles — bright and eye-catchy, not corporate.
- Confetti types on completion: personal wins (hearts), general confetti, flowers, camera flashes.
- Should feel personal and cozy — closer to a favorite notebook than a task manager.

## Tech stack (agreed)
- **Frontend**: React. Same codebase runs as a desktop web app now, and later wraps into a mobile app via **Capacitor** (or React Native if a more native feel is wanted later) — no rewrite needed to go from desktop to mobile.
- **Local/offline storage**: **IndexedDB**, via a wrapper like **Dexie.js**. This is the actual mechanism behind "offline-first, like Notes" — the app's data lives on-device first and works fully with no internet connection.
- **Sync (later phase, not v1)**: **Supabase** — offline-friendly client, handles auth, sync, and file storage (for photo attachments) in one place. Bring this in only once local-only version is working well.
- **Voice-to-text**: browser's built-in Web Speech API for v1 — free, good enough, no paid service needed yet.
- **Photos**: stored via IndexedDB (or Supabase storage once sync phase begins).

Do not introduce localStorage/sessionStorage — IndexedDB is the correct choice for structured, larger, offline-durable data.

## Explicitly deferred (not v1)
- Daily-rotating affirmations/quotes pulled from the user's own saved content.
- Voice and photo input pipelines (start with text-only items, add voice/photo once core flow is solid).
- Confetti, plant-growth, and animal/fairy companion polish.
- Multi-device sync (Supabase integration).
- Calendar view, notification pings.
- Pinterest/Instagram idea import (connect/plugins) — mentioned as a nice-to-have, not planned for near term.

## Working notes for future sessions
- The user has no prior Figma/design tool experience — prefer describing UI changes in plain terms or building quick prototypes over expecting Figma file edits.
- Prototyping/iteration on flow and layout has been happening in Claude.ai chat (clickable HTML mockups). Once a layout is agreed there, port it into this project as real React components — don't assume the chat prototypes are reusable code as-is.

## Progress so far
- Vite + React + TypeScript scaffold is set up, with Dexie installed for IndexedDB storage.
- Routing is wired with React Router: `/` → Landing, `/home` → Home, `/category/:id` → Category detail.
- Dexie schema is built (`categories` and `items` tables) and seeded on first load with the 4 starter categories (To-do/checklist, Quick ideas/notes, Quotes/notes, TBR list/journal).
- Home screen renders the category list live via `useLiveQuery`, with a working add-category flow (name input + type picker) that writes straight to Dexie.
- Category detail renders all three type-specific layouts (checklist with checkable items and a done counter, notes as free text, journal with a dotted/ruled-page look), each with an empty state.
- All of the above is committed and pushed to GitHub.
- **Not yet built**: the "add item" flow (text/voice/photo input) — this is the next planned step.

# TOEIC Vocabulary Practice App

A browser-based single-page application for practicing the top 500 TOEIC vocabulary words with Thai translations, organized into 20 themed categories.

**Live Demo:** https://tpint.github.io/toeic_practice/

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Flashcard Mode** — Flip cards to reveal definitions; mark words as known/unknown
- **Quiz Mode** — Multiple-choice questions with 4 randomized options; correct answers track mastery
- **Word List Mode** — Browse and search vocabulary by English or Thai
- **Text-to-Speech** — Pronunciation with random accent selection (US, CA, GB, AU) and adjustable speed (0.5x–1.5x)
- **Progress Tracking** — Dual tracking system (flashcard self-assessment + quiz mastery) persisted in localStorage
- **Theme Completion** — Visual indicators when all words in a theme are mastered via quiz
- **Responsive Design** — Dark-themed UI optimized for desktop, tablet, and mobile
- **Reset** — Clear all progress and start fresh

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML, CSS, JavaScript (vanilla)   |
| Speech   | Web Speech API                    |
| Storage  | Browser localStorage              |
| Testing  | Playwright                        |

No build tools, bundlers, or backend required.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Edge, Firefox, Safari)
- [Node.js](https://nodejs.org/) v18+ (for running tests only)

### Run Locally

Open `index.html` directly in a browser — no server needed.

Alternatively, serve with any static file server:

```bash
npx serve .
```

### Install Dependencies (for testing)

```bash
npm install
npx playwright install chromium
```

## Project Structure

```
toeic/
├── index.html            # Application entry point (UI + logic)
├── toeic_data.js         # Vocabulary data (500 words, themes, mappings)
├── package.json          # Project metadata and dev dependencies
├── playwright.config.js  # Playwright test configuration
├── tests/
│   └── toeic.spec.js     # End-to-end test suite
└── README.md
```

## Testing

End-to-end tests are written with [Playwright](https://playwright.dev/).

### Run Tests

```bash
npx playwright test
```

### Run Tests with UI

```bash
npx playwright test --ui
```

### Test Coverage

The test suite covers:

| Area                  | Tests |
|-----------------------|-------|
| Navigation            | Mode switching, active state management |
| Voice/Speech          | Speed control, persistence, accent filtering |
| Quiz                  | Scoring, answer validation, progression |
| Part Selector         | Theme selection, progress tracking, completion |
| Search/Filter         | English/Thai search, result counts, edge cases |
| Flashcard             | Flip, skip, know, reset, localStorage persistence |

## Deployment

### GitHub Pages

1. Push the repository to GitHub
2. Navigate to **Settings → Pages**
3. Set source branch to `main` and folder to `/ (root)`
4. The app will be available at `https://<username>.github.io/<repo-name>/`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m "Add my feature"`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. Free to use for educational purposes.
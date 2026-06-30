# TOEIC Vocabulary Practice App

A single-page web application for practicing the **Top 500 TOEIC vocabulary words** with Thai translations, organized by **20 themed categories**.

🌐 **Live Demo:** [https://tpint.github.io/toeic_practice/](https://tpint.github.io/toeic_practice/)

![TOEIC Vocab Practice](https://img.shields.io/badge/Words-500-blue) ![Themes](https://img.shields.io/badge/Themes-20-green) ![Language](https://img.shields.io/badge/Lang-EN%2FTH-orange)

## Features

- 📇 **Flashcards** — Flip cards with English on top, Thai on bottom (clearly separated)
- 📝 **Quiz Mode** — Randomized multiple choice with 4 options (English + Thai); correct answers mark words as mastered
- 📖 **Word List** — Browse and search all vocabulary by English or Thai
- 🔊 **Pronunciation** — Listen to words and every example sentence with text-to-speech
- 🌍 **Random Accents** — Each playback randomly picks from 4 accents: 🇺🇸 US, 🇨🇦 Canadian, 🇬🇧 British, 🇦🇺 Australian
- ⚡ **Speed Control** — Adjustable speech rate from 0.5x to 1.5x (saved across sessions)
- 📊 **Dual Progress Tracking** — Separate counters for flashcard self-assessment and quiz mastery
- 🏆 **Theme Completion** — Themes turn green only when all words are answered correctly in quiz mode
- 🎲 **Randomized Quiz** — Words appear in random order each session
- 🎯 **20 Themed Categories** — Words grouped by topic (Business, Finance, Travel, etc.)
- 🌙 **Dark Theme** — Modern, eye-friendly dark UI
- 📱 **Responsive** — Works on desktop, tablet, and mobile
- 🔄 **Reset Button** — Clear all progress and start fresh

## Themed Categories

| # | Theme | # | Theme |
|---|-------|---|-------|
| 1 | 💼 Business & Management | 11 | 💻 Technology & Systems |
| 2 | 💰 Finance & Banking | 12 | 🏠 Property & Facilities |
| 3 | 🏢 Office & Administration | 13 | 🤝 Customer Service |
| 4 | 👥 Human Resources | 14 | 📅 Meetings & Events |
| 5 | 📈 Marketing & Sales | 15 | 🔬 Research & Analysis |
| 6 | 💬 Communication | 16 | 🌍 Economics & Trade |
| 7 | 📋 Contracts & Legal | 17 | ✅ Quality & Compliance |
| 8 | 🏭 Manufacturing & Production | 18 | 🎯 Planning & Strategy |
| 9 | 🚚 Shipping & Logistics | 19 | ⏰ Time & Scheduling |
| 10 | ✈️ Travel & Transport | 20 | 📊 General Professional |

## What's Included

Each vocabulary word contains:
- English word and part of speech
- English definition
- Thai translation (คำแปลภาษาไทย)
- 2-3 example sentences in English with individual 🔊 buttons
- Thai translation for each example sentence

## Flashcard Layout

The back of each flashcard is divided into two clear sections:

| Section | Content |
|---------|---------|
| **Top (English)** | English meaning + example sentences (each with 🔊 button) |
| **Divider** | Visual separator line |
| **Bottom (Thai)** | Thai meaning + Thai example translations |

## How to Use

1. **Select a Theme** to focus on a specific topic
2. **Choose a mode:**
   - **Flashcards** — Click to flip, mark as Know/Don't Know (personal tracker)
   - **Quiz** — Pick the correct meaning from 4 randomized choices (mastery tracker)
   - **Word List** — Review all words, search by English or Thai
3. **Listen** — Click 🔊 to hear pronunciation (random accent each time)
4. **Adjust Speed** — Use the speed slider to slow down or speed up speech
5. **Track progress** — Overall mastery shown at top; themes turn green when all quiz answers correct

## Progress System

| Mode | What it tracks | Stored as | Affects completion? |
|------|---------------|-----------|-------------------|
| Flashcard | Self-assessment (Know/Don't Know) | `toeic_fc_known` | ❌ No |
| Quiz | Correct answers = mastered | `toeic_quiz_known` | ✅ Yes |

- Progress is saved in browser `localStorage` (persists across sessions)
- Overall mastery percentage shown in header
- Reset button clears all progress

## Tech Stack

- Pure HTML, CSS, JavaScript (no frameworks)
- Web Speech API for pronunciation
- localStorage for progress saving
- No server required — runs entirely in the browser

## File Structure

```
├── index.html      # Main app (UI + logic)
├── toeic_data.js   # 500 words + theme definitions + theme mapping
└── README.md       # This file
```

## Setup

No build steps needed. Just open `index.html` in a browser.

**Or host for free on GitHub Pages:**
1. Upload files to a GitHub repository
2. Go to Settings → Pages → Branch: main → Save
3. Access at `https://username.github.io/repo-name/`

## License

Free to use for educational purposes.
const { test, expect } = require('@playwright/test');
const path = require('path');

const APP_URL = `file:///${path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/')}`;

test.describe('TOEIC Vocabulary Practice App', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('#fcWord');
  });

  // ═══════════════════════════════════════════════════════
  // 1. NAVIGATION BETWEEN MODES
  // ═══════════════════════════════════════════════════════

  test.describe('Navigation between modes', () => {

    test('should start in Flashcard mode by default', async ({ page }) => {
      const flashcardBtn = page.locator('#btn-flashcard');
      await expect(flashcardBtn).toHaveClass(/active/);
      await expect(page.locator('#flashcardMode')).not.toHaveClass(/hidden/);
      await expect(page.locator('#quizMode')).toHaveClass(/hidden/);
      await expect(page.locator('#listMode')).toHaveClass(/hidden/);
    });

    test('should switch to Quiz mode', async ({ page }) => {
      await page.click('#btn-quiz');
      await expect(page.locator('#btn-quiz')).toHaveClass(/active/);
      await expect(page.locator('#btn-flashcard')).not.toHaveClass(/active/);
      await expect(page.locator('#quizMode')).not.toHaveClass(/hidden/);
      await expect(page.locator('#flashcardMode')).toHaveClass(/hidden/);
      await expect(page.locator('#listMode')).toHaveClass(/hidden/);
    });

    test('should switch to Word List mode', async ({ page }) => {
      await page.click('#btn-list');
      await expect(page.locator('#btn-list')).toHaveClass(/active/);
      await expect(page.locator('#listMode')).not.toHaveClass(/hidden/);
      await expect(page.locator('#flashcardMode')).toHaveClass(/hidden/);
      await expect(page.locator('#quizMode')).toHaveClass(/hidden/);
    });

    test('should switch back to Flashcard mode from Quiz', async ({ page }) => {
      await page.click('#btn-quiz');
      await page.click('#btn-flashcard');
      await expect(page.locator('#btn-flashcard')).toHaveClass(/active/);
      await expect(page.locator('#flashcardMode')).not.toHaveClass(/hidden/);
    });

    test('only one mode button should be active at a time', async ({ page }) => {
      await page.click('#btn-list');
      const activeButtons = await page.locator('.nav button.active').count();
      expect(activeButtons).toBe(1);
    });
  });

  // ═══════════════════════════════════════════════════════
  // 2. VOICE / SPEECH FUNCTIONALITY
  // ═══════════════════════════════════════════════════════

  test.describe('Voice/Speech functionality', () => {

    test('should have speed slider with default value 0.9', async ({ page }) => {
      const slider = page.locator('#speedRange');
      await expect(slider).toHaveValue('0.9');
      await expect(page.locator('#speedVal')).toHaveText('0.9x');
    });

    test('should update speed display when slider changes', async ({ page }) => {
      await page.fill('#speedRange', '1.2');
      await page.locator('#speedRange').dispatchEvent('input');
      await expect(page.locator('#speedVal')).toHaveText('1.2x');
    });

    test('should persist speed setting in localStorage', async ({ page }) => {
      await page.fill('#speedRange', '1.1');
      await page.locator('#speedRange').dispatchEvent('input');
      const saved = await page.evaluate(() => localStorage.getItem('toeic_speed'));
      expect(saved).toBe('1.1');
    });

    test('should load saved speed on page load', async ({ page }) => {
      await page.evaluate(() => localStorage.setItem('toeic_speed', '1.3'));
      await page.reload();
      await expect(page.locator('#speedRange')).toHaveValue('1.3');
      await expect(page.locator('#speedVal')).toHaveText('1.3x');
    });

    test('should have sound buttons in flashcard mode', async ({ page }) => {
      const soundBtn = page.locator('#flashcardMode .btn-sound');
      await expect(soundBtn).toBeVisible();
    });

    test('should have sound buttons in quiz mode', async ({ page }) => {
      await page.click('#btn-quiz');
      const soundBtn = page.locator('#quizMode .btn-sound');
      await expect(soundBtn).toBeVisible();
    });

    test('should filter voices to only allowed English accents', async ({ page }) => {
      const voiceCheck = await page.evaluate(() => {
        const allowedLangs = new Set(['en-US', 'en-CA', 'en-GB', 'en-AU', 'en_US', 'en_CA', 'en_GB', 'en_AU']);
        return cachedVoices.every(v => allowedLangs.has(v.lang));
      });
      expect(voiceCheck).toBe(true);
    });

    test('should not include blocked voice names', async ({ page }) => {
      const hasBlocked = await page.evaluate(() => {
        const bad = /child|kid|novelty|compact|whisper|alien|robot|cartoon|zira|anna/i;
        return cachedVoices.some(v => bad.test(v.name));
      });
      expect(hasBlocked).toBe(false);
    });

    test('speak function should call speechSynthesis', async ({ page }) => {
      const spoken = await page.evaluate(() => {
        let called = false;
        const origSpeak = speechSynthesis.speak;
        speechSynthesis.speak = () => { called = true; };
        speak('hello');
        speechSynthesis.speak = origSpeak;
        return called;
      });
      expect(spoken).toBe(true);
    });
  });

  // ═══════════════════════════════════════════════════════
  // 3. QUIZ ANSWERING AND SCORING
  // ═══════════════════════════════════════════════════════

  test.describe('Quiz answering and scoring', () => {

    test.beforeEach(async ({ page }) => {
      await page.click('#btn-quiz');
    });

    test('should display a word and 4 answer options', async ({ page }) => {
      const word = await page.locator('#qzWord').textContent();
      expect(word.length).toBeGreaterThan(0);

      const options = page.locator('.quiz-option');
      await expect(options).toHaveCount(4);
    });

    test('should show part of speech for quiz word', async ({ page }) => {
      const pos = await page.locator('#qzPos').textContent();
      expect(pos.length).toBeGreaterThan(0);
    });

    test('should mark correct answer green when selected', async ({ page }) => {
      // Find the correct answer
      const word = await page.locator('#qzWord').textContent();
      const correctMeaning = await page.evaluate((w) => {
        const wordObj = vocabulary.find(v => v.w === w);
        return wordObj ? wordObj.m : null;
      }, word);

      const correctBtn = page.locator(`.quiz-option[data-meaning="${correctMeaning}"]`);
      await correctBtn.click();
      await expect(correctBtn).toHaveClass(/correct/);
    });

    test('should mark wrong answer red and highlight correct', async ({ page }) => {
      const word = await page.locator('#qzWord').textContent();
      const correctMeaning = await page.evaluate((w) => {
        return vocabulary.find(v => v.w === w).m;
      }, word);

      // Click a wrong answer
      const wrongBtn = page.locator(`.quiz-option:not([data-meaning="${correctMeaning}"])`).first();
      await wrongBtn.click();
      await expect(wrongBtn).toHaveClass(/wrong/);

      // Correct answer should be highlighted
      const correctBtn = page.locator(`.quiz-option[data-meaning="${correctMeaning}"]`);
      await expect(correctBtn).toHaveClass(/correct/);
    });

    test('should update score after correct answer', async ({ page }) => {
      const word = await page.locator('#qzWord').textContent();
      const correctMeaning = await page.evaluate((w) => {
        return vocabulary.find(v => v.w === w).m;
      }, word);

      await page.locator(`.quiz-option[data-meaning="${correctMeaning}"]`).click();
      await expect(page.locator('#statLeft')).toHaveText('Score: 1/1');
    });

    test('should update score after wrong answer', async ({ page }) => {
      const word = await page.locator('#qzWord').textContent();
      const correctMeaning = await page.evaluate((w) => {
        return vocabulary.find(v => v.w === w).m;
      }, word);

      const wrongBtn = page.locator(`.quiz-option:not([data-meaning="${correctMeaning}"])`).first();
      await wrongBtn.click();
      await expect(page.locator('#statLeft')).toHaveText('Score: 0/1');
    });

    test('should not allow multiple answers per question', async ({ page }) => {
      const options = page.locator('.quiz-option');
      await options.first().click();
      // All buttons should be disabled now
      const allDisabled = await page.locator('.quiz-option.disabled').count();
      expect(allDisabled).toBe(4);
    });

    test('should advance to next question', async ({ page }) => {
      const firstWord = await page.locator('#qzWord').textContent();
      await page.locator('.quiz-option').first().click();
      await page.click('text=Next Question →');
      const secondWord = await page.locator('#qzWord').textContent();
      // Could be same word due to shuffle, but page should at least re-render
      expect(secondWord.length).toBeGreaterThan(0);
    });

    test('should save mastered words to localStorage', async ({ page }) => {
      const word = await page.locator('#qzWord').textContent();
      const correctMeaning = await page.evaluate((w) => {
        return vocabulary.find(v => v.w === w).m;
      }, word);

      await page.locator(`.quiz-option[data-meaning="${correctMeaning}"]`).click();
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('toeic_quiz_known') || '{}'));
      expect(Object.keys(stored).length).toBeGreaterThan(0);
    });
  });

  // ═══════════════════════════════════════════════════════
  // 4. PART SELECTOR AND PROGRESS TRACKING
  // ═══════════════════════════════════════════════════════

  test.describe('Part selector and progress tracking', () => {

    test('should render 20 theme/part buttons', async ({ page }) => {
      const partBtns = page.locator('.part-btn');
      await expect(partBtns).toHaveCount(20);
    });

    test('should have first part selected by default', async ({ page }) => {
      const firstPart = page.locator('.part-btn').first();
      await expect(firstPart).toHaveClass(/active/);
    });

    test('should switch parts when clicking part button', async ({ page }) => {
      const secondPart = page.locator('.part-btn').nth(1);
      await secondPart.click();
      await expect(secondPart).toHaveClass(/active/);
      // First part should no longer be active
      await expect(page.locator('.part-btn').first()).not.toHaveClass(/active/);
    });

    test('should show progress bar', async ({ page }) => {
      const progressBar = page.locator('.progress-bar');
      await expect(progressBar).toBeVisible();
      // The fill element exists but may have 0% width initially
      const progressFill = page.locator('#progressFill');
      await expect(progressFill).toBeAttached();
    });

    test('should update progress bar when marking words known', async ({ page }) => {
      // Mark a word as known in flashcard mode
      await page.click('text=✓ Know');
      const width = await page.locator('#progressFill').evaluate(el => el.style.width);
      expect(width).not.toBe('0%');
    });

    test('should display overall progress in subtitle', async ({ page }) => {
      const overallText = await page.locator('#overallProgress').textContent();
      expect(overallText).toContain('/500');
    });

    test('should update overall progress after quiz mastery', async ({ page }) => {
      await page.click('#btn-quiz');
      const word = await page.locator('#qzWord').textContent();
      const correctMeaning = await page.evaluate((w) => {
        return vocabulary.find(v => v.w === w).m;
      }, word);
      await page.locator(`.quiz-option[data-meaning="${correctMeaning}"]`).click();

      const text = await page.locator('#overallProgress').textContent();
      expect(text).toContain('1/500');
    });

    test('should mark part as completed when all words mastered', async ({ page }) => {
      // Simulate all words in part 0 being mastered
      await page.evaluate(() => {
        const partWords = vocabulary.filter((_, idx) => themeMap[idx] === 0);
        partWords.forEach(w => { quizKnown[w.w] = true; });
        localStorage.setItem('toeic_quiz_known', JSON.stringify(quizKnown));
        renderPartSelector();
      });
      const firstPart = page.locator('.part-btn').first();
      await expect(firstPart).toHaveClass(/completed/);
    });
  });

  // ═══════════════════════════════════════════════════════
  // 5. SEARCH / FILTER FUNCTIONALITY
  // ═══════════════════════════════════════════════════════

  test.describe('Search/Filter functionality', () => {

    test.beforeEach(async ({ page }) => {
      await page.click('#btn-list');
    });

    test('should show search box in list mode', async ({ page }) => {
      const searchBox = page.locator('#searchBox');
      await expect(searchBox).toBeVisible();
    });

    test('should display words in list mode', async ({ page }) => {
      const items = page.locator('.word-item');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);
    });

    test('should filter words by English search term', async ({ page }) => {
      await page.fill('#searchBox', 'manage');
      await page.locator('#searchBox').dispatchEvent('input');
      const items = page.locator('.word-item');
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(1);

      // Verify filtered results contain the search term in word or meaning
      const allTexts = await items.evaluateAll(els => els.map(el => el.textContent.toLowerCase()));
      const allMatch = allTexts.every(t => t.includes('manage'));
      expect(allMatch).toBe(true);
    });

    test('should filter words by Thai search term', async ({ page }) => {
      // Get a Thai word from vocabulary to search
      const thaiWord = await page.evaluate(() => vocabulary[0].th.substring(0, 4));
      await page.fill('#searchBox', thaiWord);
      await page.locator('#searchBox').dispatchEvent('input');
      const items = page.locator('.word-item');
      const count = await items.count();
      expect(count).toBeGreaterThanOrEqual(1);
    });

    test('should show count of filtered results', async ({ page }) => {
      await page.fill('#searchBox', 'work');
      await page.locator('#searchBox').dispatchEvent('input');
      const stat = await page.locator('#statLeft').textContent();
      expect(stat).toMatch(/Showing \d+ words/);
    });

    test('should show all part words when search is cleared', async ({ page }) => {
      await page.fill('#searchBox', 'test');
      await page.locator('#searchBox').dispatchEvent('input');
      const filteredCount = await page.locator('.word-item').count();

      await page.fill('#searchBox', '');
      await page.locator('#searchBox').dispatchEvent('input');
      const allCount = await page.locator('.word-item').count();
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);
    });

    test('should show no results for nonsense search', async ({ page }) => {
      await page.fill('#searchBox', 'xyzzzzznotaword');
      await page.locator('#searchBox').dispatchEvent('input');
      const count = await page.locator('.word-item').count();
      expect(count).toBe(0);
    });

    test('each word item should have a sound button', async ({ page }) => {
      const firstItem = page.locator('.word-item').first();
      await expect(firstItem.locator('.btn-sound-sm')).toBeVisible();
    });
  });

  // ═══════════════════════════════════════════════════════
  // 6. FLASHCARD INTERACTIONS
  // ═══════════════════════════════════════════════════════

  test.describe('Flashcard interactions', () => {

    test('should display a word on the front', async ({ page }) => {
      const word = await page.locator('#fcWord').textContent();
      expect(word.length).toBeGreaterThan(0);
    });

    test('should flip card on click', async ({ page }) => {
      const card = page.locator('#flashcard');
      await expect(card).not.toHaveClass(/flipped/);
      await card.click();
      await expect(card).toHaveClass(/flipped/);
    });

    test('should show meaning on back after flip', async ({ page }) => {
      await page.locator('#flashcard').click();
      const meaning = await page.locator('#fcMeaning').textContent();
      expect(meaning.length).toBeGreaterThan(0);
    });

    test('should advance card with Skip button', async ({ page }) => {
      const firstWord = await page.locator('#fcWord').textContent();
      await page.click('text=→ Skip');
      const secondWord = await page.locator('#fcWord').textContent();
      expect(secondWord).not.toBe(firstWord);
    });

    test('should mark word as known and advance', async ({ page }) => {
      const firstWord = await page.locator('#fcWord').textContent();
      await page.click('text=✓ Know');
      const secondWord = await page.locator('#fcWord').textContent();
      expect(secondWord).not.toBe(firstWord);
    });

    test('should save flashcard known status to localStorage', async ({ page }) => {
      await page.click('text=✓ Know');
      const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('toeic_fc_known') || '{}'));
      expect(Object.keys(stored).length).toBe(1);
    });

    test('should reset card to front when advancing', async ({ page }) => {
      await page.locator('#flashcard').click(); // flip
      await page.click('text=→ Skip');
      await expect(page.locator('#flashcard')).not.toHaveClass(/flipped/);
    });

    test('Reset button should clear all progress', async ({ page }) => {
      await page.click('text=✓ Know');
      page.on('dialog', dialog => dialog.accept());
      await page.click('text=🔄 Reset');
      const fcKnown = await page.evaluate(() => JSON.parse(localStorage.getItem('toeic_fc_known') || '{}'));
      const quizKnown = await page.evaluate(() => JSON.parse(localStorage.getItem('toeic_quiz_known') || '{}'));
      expect(Object.keys(fcKnown).length).toBe(0);
      expect(Object.keys(quizKnown).length).toBe(0);
    });
  });
});

const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const OUTPUT_DIR = path.resolve(process.cwd(), "output/doc/screenshots");
const BASE_URL = "https://deepanshu306.github.io/iot-ai-learning-analytics-math/";
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const ANSWERS = {
  "If 3x + 5 = 20, what is the value of x?": "5",
  "What is the value of sin 30 degrees?": "1/2",
  "Enter the derivative of x^3 evaluated at x = 2.": "12",
  "One root of x^2 - 7x + 12 = 0 is 3. Enter the other root.": "4",
  "Enter the acute angle in degrees for which tan(theta) = 1.": "45",
  "Evaluate the integral of 2x from x = 0 to x = 3.": "9",
  "Which expression is equal to a^2 - b^2?": "(a - b)(a + b)",
  "Which identity is always true?": "sin^2(theta) + cos^2(theta) = 1",
  "What is the limit of (x^2 - 1)/(x - 1) as x approaches 1?": "2",
  "The first term of an AP is 7 and the common difference is 3. Enter the 10th term.": "34",
  "If x = 45 degrees, enter the value of 2sin(x)cos(x).": "1",
  "Which is the derivative of (3x + 1)^2?": "6(3x + 1)"
};

async function ensureDir() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function newPage(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 2200 }
  });
  const page = await context.newPage();
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  return { context, page };
}

async function login(page, email, password, waitSelector) {
  await page.fill("#email", email);
  await page.fill("#password", password);
  await page.click("#loginButton");
  await page.waitForSelector(waitSelector);
}

async function save(page, fileName, fullPage = false) {
  await page.screenshot({
    path: path.join(OUTPUT_DIR, fileName),
    fullPage
  });
}

async function answerCurrentQuestion(page) {
  const prompt = (await page.locator("#quizQuestionPrompt").innerText()).trim();
  const answer = ANSWERS[prompt];
  if (!answer) {
    throw new Error(`No answer mapping found for prompt: ${prompt}`);
  }

  const numericInput = page.locator("#numericQuizAnswer");
  if (await numericInput.count()) {
    await numericInput.fill(String(answer));
    return;
  }

  await page.evaluate((selectedAnswer) => {
    const inputs = Array.from(document.querySelectorAll('input[name="quiz-answer"]'));
    const target = inputs.find((input) => input.value === selectedAnswer);
    if (!target) {
      throw new Error(`Unable to find option ${selectedAnswer}`);
    }
    target.click();
    target.dispatchEvent(new Event("change", { bubbles: true }));
  }, answer);
}

async function completeQuiz(page) {
  for (let index = 0; index < Object.keys(ANSWERS).length; index += 1) {
    await answerCurrentQuestion(page);
    const isLast = index === Object.keys(ANSWERS).length - 1;
    if (!isLast) {
      await page.click("#quizNextButton");
      await page.waitForTimeout(150);
    }
  }

  await page.click("#quizSubmitButton");
  await page.waitForSelector("#studentResultView:not(.hidden)");
}

async function captureStaticPage(browser, relativePath, fileName) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 2200 }
  });
  const page = await context.newPage();
  await page.goto(new URL(relativePath, BASE_URL).toString(), { waitUntil: "networkidle" });
  await save(page, fileName, false);
  await context.close();
}

async function main() {
  await ensureDir();
  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_PATH
  });

  await captureStaticPage(browser, "./project-motive.html", "project-motive.png");
  await captureStaticPage(browser, "./iot-architecture.html", "iot-architecture.png");

  {
    const { context, page } = await newPage(browser);
    await save(page, "landing-page.png");
    await login(page, "aanya@student.demo", "math123", "#studentSection:not(.hidden)");
    await save(page, "student-dashboard.png");
    await page.click("#startQuizButton");
    await page.waitForSelector("#studentQuizView:not(.hidden)");
    await save(page, "student-quiz.png");
    await completeQuiz(page);
    await save(page, "student-result.png");
    await context.close();
  }

  {
    const { context, page } = await newPage(browser);
    await login(page, "nidhi@teacher.demo", "teach123", "#teacherSection:not(.hidden)");
    await save(page, "teacher-dashboard.png");
    await context.close();
  }

  {
    const { context, page } = await newPage(browser);
    await login(page, "admin@demo.local", "admin123", "#adminSection:not(.hidden)");
    await save(page, "admin-dashboard.png");
    await context.close();
  }

  await browser.close();
  console.log(`Captured screenshots in ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

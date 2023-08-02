const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch() // ({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://hurawatch.at/movie/john-wick-chapter-4-x1n08/1-full", {timeout: 30000, waitUntil: 'domcontentloaded'});

  // Get the text content of the h1 tag
  const quality = await page.evaluate(() => {
    return document.querySelector("span.quality").textContent;
  });

  console.log(`"John Wick Chapter 4" quality: ${quality}`);

  await browser.close();
})();

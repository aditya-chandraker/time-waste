const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

const channels = ["MarkRober", "MrBeast", "Veritasium"];

async function scrapeChannelVideos(channelName) {
  const website = `https://www.youtube.com/@${channelName}/videos`;

  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();

  await page.goto(website);

  // Youtube
  const videoTitles = await page.$$eval(
    "yt-formatted-string#video-title",
    (titles) =>
      titles.slice(0, 3).map((title) => ({
        title: title.textContent.trim(),
        url: `https://www.youtube.com${title.parentElement.getAttribute(
          "href"
        )}`,
      }))
  );

  return videoTitles;
}

app.get("/", async (req, res) => {
  try {
    const videoTitles = await Promise.all(
      channels.map((channel) => scrapeChannelVideos(channel))
    );

    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();

    // Instagram
    await page.goto("https://www.instagram.com/uconnlatenight/");

    // Wait for the parent tag to load
    await page.waitForSelector("div._aagu");

    // Get the first three instances of the parent tag
    const parentElements = await page.$$eval("div._aagu", (elements) => {
      return elements.slice(0, 3).map((element) => element.innerHTML);
    });

    // Extract and display the description from each parent element
    parentElements.forEach((html, index) => {
      const description = html.match(/alt="(.*?)"/)[1];
      console.log(`Description ${index + 1}: ${description}`);
    });

    browser.close();

    console.log(parentElements);

    const html = `
        <html>
          <head>
            <title>Time-waste</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
          </head>
          <body>
            <div class="container mt-4">
              <table class="table">
                <thead>
                  <tr>
                    ${channels.map((channel) => `<th>${channel}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    ${videoTitles
                      .map(
                        (titles) =>
                          `<td>
                            <ul class="list-group">
                              ${titles
                                .map(
                                  (video) =>
                                    `<li class="list-group-item"><a href="${video.url}">${video.title}</a></li>`
                                )
                                .join("")}
                            </ul>
                          </td>`
                      )
                      .join("")}
                  </tr>
                </tbody>
              </table>
            </div>
          </body>
        </html>
      `;

    res.send(html);
  } catch (error) {
    console.log(error, error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});

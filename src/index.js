// const express = require("express");
// const cheerio = require("cheerio");
// const axios = require("axios");

// const app = express();

// const PORT = process.env.PORT || 3000;

// const website = "https://news.sky.com";
// // const website = "https://www.youtube.com/@MarkRober/videos";

// try {
//   axios(website).then((res) => {
//     const data = res.data;
//     const $ = cheerio.load(data);

//     let content = [];

//     $(".sdc-site-tile__headline", data).each(function () {
//       const title = $(this).text();
//       const url = $(this).find("a").attr("href");

//       content.push({
//         title,
//         url
//       });

//       app.get("/", (req, res) => {
//         res.json(content);
//       });
//     });
//   });
// } catch (error) {
//   console.log(error, error.message);
// }

// app.listen(PORT, () => {
//   console.log(`server is running on PORT:${PORT}`);
// });


// const express = require("express");
// const cheerio = require("cheerio");
// const axios = require("axios");

// const app = express();

// const PORT = process.env.PORT || 3000;

// const website = "https://www.youtube.com/@MarkRober/videos";

// try {
//   axios(website).then((res) => {
//     const data = res.data;
//     const $ = cheerio.load(data);
//     console.log(data);

//     let content = [];

//     $("yt-formatted-string", data).each(function (index) {
//       if (index < 3) {
//         const title = $(this).text().trim();
//         console.log(title);
//         const url = $(this).parent().attr("href");

//         content.push({
//           title,
//           url: `https://www.youtube.com${url}`
//         });
//       }
//     });

//     app.get("/", (req, res) => {
//       res.json(content);
//     });
//   });
// } catch (error) {
//   console.log(error, error.message);
// }

// app.listen(PORT, () => {
//   console.log(`server is running on PORT:${PORT}`);
// });

const express = require("express");

const puppeteer = require("puppeteer");

const app = express();

const PORT = process.env.PORT || 3000;

const website = "https://www.youtube.com/@MarkRober/videos";

app.get("/", async (req, res) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(website);

    const videoTitles = await page.$$eval(
      "yt-formatted-string#video-title",
      (videoTitles) =>
        videoTitles
          .slice(0, 3)
          .map((videoTitle) => ({
            title: videoTitle.textContent.trim(),
            url: `https://www.youtube.com${videoTitle.parentElement.getAttribute(
              "href"
            )}`,
          }))
    );

    await browser.close();

    res.json(videoTitles);
  } catch (error) {
    console.log(error, error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`server is running on PORT:${PORT}`);
});
const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    'headless': true,
    'args': ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({width: 1366, height: 768});
  await page.goto('https://www.google.com');
  await page.waitFor(1000);
  await page.screenshot({path: 'output/sample.png'});

  await browser.close();
})();

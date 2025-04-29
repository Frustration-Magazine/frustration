import puppeteer, { Browser } from "puppeteer";
import chromium from "@sparticuz/chromium-min";
import puppeteerCore, { Browser as BrowserCore } from "puppeteer-core";

const remoteExecutablePath = "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar";

export async function fetchTipeeeTotal(): Promise<{ amount: number; customers: number }> {
  let totalTipeee = 0;
  let customersTipeee = 0;

  let browser: Browser | BrowserCore;

  if (process.env.NODE_ENV !== "development") {
    browser = await puppeteerCore.launch({
      executablePath: await chromium.executablePath(remoteExecutablePath),
      args: chromium.args,
      defaultViewport: null
    });
  } else {
    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null
    });
  }

  const page = await browser.newPage();

  await page.goto("https://fr.tipeee.com/frustration-magazine", {
    waitUntil: "domcontentloaded"
  });

  await page.waitForSelector(".p-results-panel");

  const totalHandle = await page.$(".p-results-panel .p-result-item:first-child .p-value span");
  const customersHandle = await page.$(".p-results-panel .p-result-item:nth-child(2) .p-value");
  console.log("eveything working fine !");
  console.log("page", page);
  // if (totalHandle) {
  //   totalTipeee = await totalHandle.evaluate((el: any) => el.textContent.trim()?.replace(/\s/g, "")?.match(/\d+/)?.at(0));
  // }
  // if (customersHandle) {
  //   customersTipeee = await customersHandle.evaluate((el: any) => el.textContent.trim()?.replace(/\s/g, "")?.match(/\d+/)?.at(0));
  // }

  await browser.close();
  return { amount: 0, customers: 0 };
}

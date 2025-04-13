import puppeteer from "puppeteer";
export async function fetchTipeeeTotal(): Promise<{ amount: number; customers: number }> {
  let totalTipeee = 0;
  let customersTipeee = 0;
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null
  });

  const page = await browser.newPage();

  await page.goto("https://fr.tipeee.com/frustration-magazine", {
    waitUntil: "domcontentloaded"
  });

  await page.waitForSelector(".p-results-panel");

  const totalHandle = await page.$(".p-results-panel .p-result-item:first-child .p-value span");
  const customersHandle = await page.$(".p-results-panel .p-result-item:nth-child(2) .p-value");
  if (totalHandle) {
    totalTipeee = await totalHandle.evaluate((el: any) => el.textContent.trim()?.replace(/\s/g, "")?.match(/\d+/)?.at(0));
  }
  if (customersHandle) {
    customersTipeee = await customersHandle.evaluate((el: any) => el.textContent.trim()?.replace(/\s/g, "")?.match(/\d+/)?.at(0));
  }

  await browser.close();
  return { amount: +totalTipeee, customers: +customersTipeee };
}

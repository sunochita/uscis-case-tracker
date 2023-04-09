import { test } from "@playwright/test";
import fs from "fs";

const RECEIPTS = [
  // "case number #00",
  // "case number #01",
  // etc
];

function appendToTxt(text) {
  fs.appendFile("output.txt", text, (err) => {
    if (err) throw err;
  });
}

test.beforeAll(async ({}) => {
  fs.writeFile("output.txt", "", (err) => {
    if (err) throw err;
  });
});

test.beforeEach(async ({ page }) => {
  await page.goto("https://egov.uscis.gov/casestatus/landing.do");
});

RECEIPTS.forEach((receipt) => {
  test.describe("Test...", () => {
    test(`${receipt}`, async ({ page }) => {
      const caseInputField = page.locator("#receipt_number");
      const checkStatusBtn = page.getByTitle("CHECK STATUS");
      const status = page.locator("[aria-live='assertive'] p");

      await caseInputField.fill(receipt);
      await checkStatusBtn.click();

      try {
        const result = await status.textContent();

        if (typeof result === "string") {
          appendToTxt(result + "\n\n");
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
});
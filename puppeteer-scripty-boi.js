const puppeteer = require("puppeteer")

const slotNotAvailableWhatASurprise = "(No available time slots)"

const checkIfShitsFinallyReady = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  const context = browser.defaultBrowserContext()
  context.overridePermissions("https://shop.countdown.co.nz", ["notifications"])
  await page.goto("https://shop.countdown.co.nz/shop/deliverydetails")
  await page.screenshot({ path: "example.png" })

  let slotDetails = await page.evaluate(() => {
    let deliverySlots = [...document.querySelectorAll(".window-day .multi-line-description div")]
    return deliverySlots.map(div => div.textContent.trim())
  })

  const yupNoSlotsAvailable = slotDetails.every(slot => slot === slotNotAvailableWhatASurprise)

  // eslint-disable-next-line no-console
  console.log("yupNoSlotsAvailable:", yupNoSlotsAvailable)

  await browser.close()
}

checkIfShitsFinallyReady()

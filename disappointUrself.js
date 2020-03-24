const puppeteer = require("puppeteer")
const notifier = require("node-notifier")
const { wait } = require("./wait")

const setSuburbPage = "https://shop.countdown.co.nz/shop/showaddresses"
const getDisappointedPage = "https://shop.countdown.co.nz/shop/deliverydetails"
const suburb = process.argv[2]
const intervalInMinutes = process.argv[3] * 60000
const suburbInput = "input[name=PostcodeSuburb]"
const suburbSubmitButton = "input[type=submit]"

const getDisappointedBra = async page => {
  await page.screenshot({ path: "latest-screenshot.png", fullPage: true })

  const slotsAvailable = await page.evaluate(() => {
    let openSlots = [...document.querySelectorAll(".open-delivery-window")]

    return openSlots.some(slot => getComputedStyle(slot, null).display === "block")
  })

  notifier.notify({
    title: "Countdown Check",
    message: slotsAvailable ? "✅ Get in there quick! ✅" : "❌ Still no slots available! ❌"
  })
}

const reloadAndRecheck = async page => {
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
  await getDisappointedBra(page)
}

const checkIfShitsFinallyAvailable = async () => {
  const browser = await puppeteer.launch({ defaultViewport: { width: 2560, height: 1440 } })
  const page = await browser.newPage()

  await page.goto(setSuburbPage, { waitUntil: "networkidle0" })
  await page.waitFor(suburbInput)

  await page.evaluate(suburbInput => {
    document.querySelector(suburbInput).value = ""
  }, suburbInput)

  await page.type(suburbInput, suburb, { delay: 100 })

  await wait(2)

  await page.keyboard.press("ArrowDown")
  await page.keyboard.press("Enter")
  await page.click(suburbSubmitButton)

  await wait(2)

  await page.goto(getDisappointedPage, { waitUntil: "networkidle0" })

  await getDisappointedBra(page)

  setInterval(() => reloadAndRecheck(page), intervalInMinutes)
}

checkIfShitsFinallyAvailable()

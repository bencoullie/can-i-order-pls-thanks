const puppeteer = require("puppeteer")
const { wait } = require("./wait")
const { getDisappointedBra } = require("./getDisappointedBra")
const { reloadAndRecheck } = require("./reloadAndRecheck")

const setSuburbPage = "https://shop.countdown.co.nz/shop/showaddresses"
const getDisappointedPage = "https://shop.countdown.co.nz/shop/deliverydetails"
const suburb = process.argv[2]
const intervalInMinutes = process.argv[3] ? process.argv[3] * 60000 : 20000
const suburbInput = "input[name=PostcodeSuburb]"
const suburbSubmitButton = "input[type=submit]"

const checkIfShitsFinallyAvailable = async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: { width: 2560, height: 1440 } })
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

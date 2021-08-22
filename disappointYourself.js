const puppeteer = require('puppeteer')
const { wait } = require('./wait')
const { getDisappointedBra } = require('./getDisappointedBra')
const { reloadAndRecheck } = require('./reloadAndRecheck')

const getDisappointedPage = 'https://shop.countdown.co.nz/bookatimeslot'
const suburb = process.argv[2]
const intervalInMinutes = process.argv[3] ? process.argv[3] * 60000 : 20000
const chooseAddressButton = '.bookTimeSlot-details button'
const suburbInput = '[data-cy=suburb]'
const suburbSubmitButton = '#suburb-selection-form button'

const checkIfShitsFinallyAvailable = async () => {
  const browser = await puppeteer.launch({
    defaultViewport: { width: 2560, height: 1440 },
  })
  const page = await browser.newPage()
  page.setUserAgent(
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36'
  )

  await page.goto(getDisappointedPage, { waitUntil: 'networkidle0' })
  // await page.screenshot({ path: 'arriving-on-page.png', fullPage: true })
  await page.waitFor(chooseAddressButton)

  await page.click(chooseAddressButton)
  await page.waitFor(suburbInput)

  await page.evaluate((suburbInput) => {
    document.querySelector(suburbInput).value = ''
  }, suburbInput)

  await page.type(suburbInput, suburb, { delay: 100 })

  await wait(3)

  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')
  await page.click(suburbSubmitButton)

  await wait(3)

  await getDisappointedBra(page)

  setInterval(() => reloadAndRecheck(page), intervalInMinutes)
}

checkIfShitsFinallyAvailable()

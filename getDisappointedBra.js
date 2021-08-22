const notifier = require('node-notifier')

module.exports.getDisappointedBra = async (page) => {
  await page.screenshot({ path: 'latest-screenshot-final.png', fullPage: true })

  const stillBlockedUp = await page.evaluate(() => {
    const agggghhhhhhhh =
      'All our delivery times are fully booked for the next few days'

    return document
      .querySelectorAll('.alert-label')[1]
      .innerText.includes(agggghhhhhhhh)
  })

  notifier.notify({
    title: 'Countdown Check',
    message: !stillBlockedUp
      ? '✅ Get in there quick! ✅'
      : '❌ Still no slots available! ❌',
    open: 'https://shop.countdown.co.nz/bookatimeslot',
  })
}

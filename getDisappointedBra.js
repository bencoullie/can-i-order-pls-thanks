const notifier = require("node-notifier")

module.exports.getDisappointedBra = async page => {
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

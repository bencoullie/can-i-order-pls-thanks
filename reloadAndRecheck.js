const { getDisappointedBra } = require("./getDisappointedBra")

module.exports.reloadAndRecheck = async page => {
  await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] })
  await getDisappointedBra(page)
}

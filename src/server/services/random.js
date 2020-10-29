import User from '../database/User'
import rand from 'unique-random'
import slugify from 'slugify'
/**
 *
 * @param {Number} numberLenght - Als Beispiel 4 = 3492
 * @description Erstellt eine Random number
 */
function generateNumber (numberLenght) {
  const numbers = []

  for (let i = 0; i < numberLenght; i++) {
    const number = rand(1, 9)
    numbers.push(number())
  }

  return numbers.join('')
}

/**
 *
 * @param {String} prefix
 * @param {number} [numberLenght=4]
 * @description erstellt eine custom unique id wenn diese beim User noch nicht vorhanden ist
 */
async function makeNumber (prefix, numberLenght = 4) {
  const number = generateNumber(numberLenght)

  const inviteID = await makeInviteID(prefix, number)

  if (!inviteID) {
    await makeNumber(prefix, 4)
  } else {
    return slugify(inviteID)
  }
}

async function makeInviteID (firstName, number) {
  const inviteID = `${firstName}${number}`
  const isUser = await User.findOne({ inviteID })
  if (!isUser) {
    return inviteID
  } else {
    return false
  } //
}

export default makeNumber

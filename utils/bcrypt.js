const bcrypt = require('bcrypt')

async function hashPassword(password) {
  let hashedPassword = await bcrypt.hash(password, 10)
  return hashedPassword
}

async function comparePassword(password, hashedPassword) {
  let result = await bcrypt.compare(password, hashedPassword)
  return result
}

module.exports = {
  hashPassword,
  comparePassword
}
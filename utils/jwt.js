const jwt = require('jsonwebtoken')

async function createToken(_id) {
  let payload = { _id }
  const token = await jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' })
  return token
}

async function verifyToken(token) {
  const result = await jwt.verify(token, process.env.JWT_SECRET)
  return result._id
}

module.exports = {
  createToken,
  verifyToken
}
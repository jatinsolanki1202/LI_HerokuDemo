const usermodel = require('../models/user.model.js');
const { verifyToken } = require('../utils/jwt.js')

async function userAuth(req, res, next) {
  let token = req.cookies.token;

  if (!token) return res.status(401).redirect('/login')

  let tokenId = await verifyToken(token)
  if (!tokenId) return res.status(401).redirect('/login', 401)

  let decoded = await usermodel.findOne({ _id: tokenId })
  req.user = decoded
  next()
}

module.exports = userAuth
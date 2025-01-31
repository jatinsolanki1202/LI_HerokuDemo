const { compare } = require('bcrypt')
const usermodel = require('../models/user.model.js')
const { hashPassword, comparePassword } = require('../utils/bcrypt.js')
const { createToken, verifyToken } = require('../utils/jwt.js')

async function registerPage(req, res) {
  res.status(200).render('/views/register')
}

async function register(req, res) {
  let { fname, lname, dob, email, password, cnfPassword, gender } = req.body
  console.log(dob)
  if (!fname, !lname, !dob, !email, !password, !cnfPassword, !gender)
    return res.status(400).json({ message: "all fields are required", status: 400 })

  if (password != cnfPassword) return res.status(400).json({
    "message": "Password and confirm password do not match.",
    "status": 400
  })

  let existingUser = await usermodel.findOne({ email })
  if (existingUser) return res.status(409).json({ message: "user already registered", status: 409 })

  let hashedPassword = await hashPassword(password)

  const newUser = await usermodel.create({
    fname, lname, dob: new Date(dob), email, password: hashedPassword, gender
  })

  const token = await createToken(newUser._id)
  res.cookie("token", token)

  res.status(200).redirect('/')
}

async function loginPage(req, res) {
  res.render('/views/login')
}

async function login(req, res) {
  let { email, password } = req.body
  if (!email, !password)
    return res.status(400).json({ message: "all fields are required", status: 400 })

  let user = await usermodel.findOne({ email })
  if (!user) return res.status(401).json({ message: "invalid username or password", status: 401 })

  let isValidPassword = await comparePassword(password, user.password)
  if (!isValidPassword) return res.status(401).json({ message: "invalid username or password", status: 401 })

  let token = await createToken(user._id)
  res.cookie("token", token)
  return res.status(200).redirect('/')
}

async function homePage(req, res) {
  try {
    let user = req.user
    res.status(200).render('/views/home', { user })
  } catch (err) {
    console.log('error encountered: ', err.message)
  }
}

async function logout(req, res) {
  res.clearCookie('token')
  res.status(200).redirect('/')
}

function deletePage(req, res) {
  res.render('/views/deleteProfile')
}

async function deleteProfile(req, res) {
  let { password } = req.body
  if (!password) return res.status(400).json({ message: "password is required" })

  let isValidPassword = await comparePassword(password, req.user.password)

  if (!isValidPassword) return res.status(400).redirect('/delete-profile')

  await usermodel.deleteOne({ _id: req.user._id })
  res.status(302).redirect('/login')
}

function updateProfilePage(req, res) {
  res.render('/views/updateProfile', { user: req.user })
}

async function updateProfile(req, res) {
  let { fname, lname, dob, password, gender } = req.body

  if (password) var hashedPassword = await hashPassword(password)

  await usermodel.findOneAndUpdate({ _id: req.user._id }, {
    fname, lname, dob, gender, password: hashedPassword
  })

  res.status(302).redirect('/')
}

module.exports = {
  registerPage,
  register,
  loginPage,
  login,
  homePage,
  logout,
  deletePage,
  deleteProfile,
  updateProfilePage,
  updateProfile
}
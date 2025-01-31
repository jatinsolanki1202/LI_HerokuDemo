const { compare } = require('bcrypt')
const usermodel = require('../models/user.model.js')
const { hashPassword, comparePassword } = require('../utils/bcrypt.js')
const { createToken, verifyToken } = require('../utils/jwt.js')

async function registerPage(req, res) {
  try {
    res.status(200).render('register')
  } catch (err) {
    console.log("error rendering register page: ", err.message)
  }
}

async function register(req, res) {
  try {
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
  } catch (err) {
    console.log("error registering user: ", err.message)
  }
}

async function loginPage(req, res) {
  try {
    res.render('login')
  } catch (err) {
    console.log("error rendering login page: ", err.message)
  }
}

async function login(req, res) {
  try {
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
  } catch (err) {
    console.log("error logging in user: ", err.message)
  }
}

async function homePage(req, res) {
  try {
    let user = req.user
    res.status(200).render('home', { user })
  } catch (err) {
    console.log('error encountered: ', err.message)
  }
}

async function logout(req, res) {
  try {
    res.clearCookie('token')
    res.status(200).redirect('/')
  } catch (err) {
    console.log("error logging out: ", err.message)
  }
}

function deletePage(req, res) {
  try {
    res.render('deleteProfile')
  } catch (err) {
    console.log("error rendering delete page: ", err.message)
  }
}

async function deleteProfile(req, res) {
  try {
    let { password } = req.body
    if (!password) return res.status(400).json({ message: "password is required" })

    let isValidPassword = await comparePassword(password, req.user.password)

    if (!isValidPassword) return res.status(400).redirect('/delete-profile')

    await usermodel.deleteOne({ _id: req.user._id })
    res.status(302).redirect('/login')
  } catch (err) {
    console.log("error deleting profile: ", err.message)
  }
}

function updateProfilePage(req, res) {
  try {
    res.render('updateProfile', { user: req.user })
  } catch (err) {
    console.log("error rendering profile update page: ", err.message)
  }
}

async function updateProfile(req, res) {
  try {
    let { fname, lname, dob, password, gender } = req.body

    if (password) var hashedPassword = await hashPassword(password)

    await usermodel.findOneAndUpdate({ _id: req.user._id }, {
      fname, lname, dob, gender, password: hashedPassword
    })

    res.status(302).redirect('/')
  } catch (err) {
    console.log("error updating profile: ", err.message)
  }
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
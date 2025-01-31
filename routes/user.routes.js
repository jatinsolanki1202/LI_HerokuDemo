const express = require('express')
const { homePage, register, login, loginPage, logout, deleteProfile, registerPage, deletePage, updateProfilePage, updateProfile } = require('../controllers/user.controller.js')
const userAuth = require('../middlewares/userAuth.js')

const router = express.Router()

//GET routes
router.get("/", userAuth, homePage)
router.get('/login', loginPage)
router.get('/logout', logout)
router.get('/register', registerPage)
router.get('/delete-profile', userAuth, deletePage)
router.get('/update-profile', userAuth, updateProfilePage)

//POST routes
router.post('/register', register)
router.post('/login', login)
router.post('/delete-profile', userAuth, deleteProfile)
router.post('/update-profile', userAuth, updateProfile)

module.exports = router
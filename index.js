const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const userRouter = require('./routes/user.routes.js')
const dbConnection = require('./config/db.js')
const path = require('path');

dbConnection()
const app = express()

app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.use('/', userRouter)

app.listen(process.env.PORT)

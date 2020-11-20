const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const db = require('./db/db.js')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const authRouter = require('./routes/auth.js')
app.use('/users/auth', authRouter)

module.exports = app

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const config = require('./utils/config')
const logger = require('./utils/logger')
const cors = require('cors')
require('dotenv').config()

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to mongoSB')
    })
    .catch(() => {
        logger.error('error connecting to MongoDB')
    })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app
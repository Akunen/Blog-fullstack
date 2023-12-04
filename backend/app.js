const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

  app.use(cors())
  app.use(express.json())
  app.use(middleware.requestLogger)
  app.use(middleware.tokenExtractor)
  app.use(middleware.userExtractor)

  app.use('/api/blogs', blogRouter)
  app.use('/api/users', userRouter)
  app.use('/api/login', loginRouter)


  app.use(middleware.unknownEndpoint)
  app.use(middleware.errorHandler)


  module.exports = app
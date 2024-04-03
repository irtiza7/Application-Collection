const Express = require('express')
const Morgan = require('morgan')
const CORS = require('cors')
const Router = require('./routes')
require('dotenv').config()

const serverApp = Express()

serverApp.use(CORS())
serverApp.use(Morgan('common'))
serverApp.use('/', Router)

serverApp.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`)
})

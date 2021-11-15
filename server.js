const express = require('express')
const favicon = require('serve-favicon')
const chalk = require('chalk')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()
const methodOverride = require('method-override')
const postRoutes = require('./routes/post-routes')
const postApiRoutes = require('./routes/api-post-routes')
const contactRoutes = require('./routes/contact-routes')
const path = require('path')
const createPath = require('./helpers/create-path')

const errorMsg = chalk.bgKeyword('white').redBright
const successMsg = chalk.bgKeyword('green').black

const app = express()

app.use(favicon(path.join(__dirname, 'public', 'favicon.png')))

app.set('view engine', 'ejs')


mongoose
  .connect(process.env.MONGO_URL)
  .then((res) => console.log(successMsg('Connected to DB')))
  .catch((error) => console.log(errorMsg(error)))

app.listen(process.env.PORT,  (error) => {
  error ? console.log(errorMsg(error)) : console.log(successMsg(`listening port ${process.env.PORT}`))
})

// Middlewares
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

app.use(express.urlencoded({extended: false}))

app.use(express.static('styles'))

app.use(methodOverride('_method'))

// Routs
app.get('/', (req, res) => {
  const title = 'Home'
  res.render(createPath('index'), { title })
})

app.use(postRoutes)
app.use(postApiRoutes)
app.use(contactRoutes)

app.use((req, res) => {
  const title = 'Error Page'
  res
    .status(404)
    .render(createPath('error'), { title })
})

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import indexRoutes from './routes/index.routes.js'
import { PORT } from './config/config.js'

const app = express()

dotenv.config({ path: './env/.env' })

app.use(cors())
app.use(cookieParser())

app.set('views', [ './public/views' ])
app.set('view engine', 'ejs')

app.use(express.static('./public'))
app.use(express.static('./public/views'))
app.use(express.static('./public/assets/css'))
app.use(express.static('./public/assets/js'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(function (req, res, next) {
  if (!req.user) { res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate') }
  next()
})

app.use(indexRoutes)

app.listen(PORT)
console.log('Server is listening on port', PORT)

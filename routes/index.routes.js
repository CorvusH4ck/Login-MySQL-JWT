import express from 'express'
import connector from '../database/db.js'
import {
  login,
  logout,
  isAuthenticated
} from '../controllers/authController.js'

const router = express.Router()

let USER = null

router.get('/', isAuthenticated, function (req, res) {
  connector.query('SELECT * FROM clients', function (error, results) {
    if (error) {
      throw error
    } else {
      USER = req.user
      res.render('index', { user: USER, count: results.length })
    }
  })
})

router.get('/login', function (req, res) {
  if (req.cookies.jwt) {
    res.redirect('/')
  } else {
    res.render('login', { alert: '' })
  }
})

router.post('/login', login)
router.get('/logout', logout)

export default router

import connector from '../database/db.js'
import Jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { promisify } from 'util'

export const register = async function (req, res) {
  try {
    const name = req.body.name
    const user = req.body.user
    const password = req.body.password
    const passHash = await bcryptjs.hash(password, 8)
    connector.query('INSERT INTO users SET ?', { user, name, password: passHash }, (error, results) => {
      if (error) { console.log(error) }
      res.redirect('/')
    })
  } catch (error) {
    console.log(error)
  }
}

export const login = async function (req, res) {
  try {
    const user = req.body.user
    const password = req.body.password

    if (!user || !password) {
      res.render('login', {
        alert: 'incorrectLogin',
        alertTitle: 'Advertencia',
        alertMessage: 'Ingrese un usuario y contraseña',
        alertIcon: 'info',
        ruta: 'login'
      })
    } else {
      connector.query('SELECT * FROM users WHERE user = ?', user, async function (_error, results) {
        if (results.length === 0 || !(await bcryptjs.compare(password, results[0].password))) {
          res.render('login', {
            alert: 'incorrectLogin',
            alertTitle: 'Error',
            alertMessage: 'Usuario y/o Contraseña incorrectas',
            alertIcon: 'error',
            ruta: 'login'
          })
        } else {
          const id = results[0].id
          const token = Jwt.sign({ id }, process.env.JWT_SECRETO, {
            expiresIn: process.env.JWT_TIEMPO_EXPIRA
          })

          const cookiesOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
          }
          res.cookie('jwt', token, cookiesOptions)
          res.render('login', {
            alert: 'successfulLogin'
          })
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const isAuthenticated = async function (req, res, next) {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(Jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
      connector.query('SELECT * FROM users WHERE id = ?', [decodificada.id], function (_error, results) {
        if (!results) { return next() }
        req.user = results[0]
        return next()
      })
    } catch (error) {
      console.log(error)
      return next()
    }
  } else {
    res.redirect('/login')
  }
}

export const logout = function (req, res) {
  res.clearCookie('jwt')
  return res.redirect('/')
}

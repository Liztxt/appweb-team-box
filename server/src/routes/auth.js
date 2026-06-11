const express = require('express')
const router = express.Router()
const { body, validationResult } = require('express-validator')
const { register, login, me } = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')
const Empleado = require('../models/Empleado')
const bcrypt = require('bcrypt')

// Middleware para manejar errores de validación
const validar = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: errores.array()[0].msg })
  }
  next()
}

// Registro
router.post('/register',
  [
    body('numeroEmpleado')
      .trim()
      .notEmpty().withMessage('El número de empleado es obligatorio')
      .isLength({ min: 3, max: 20 }).withMessage('El número de empleado debe tener entre 3 y 20 caracteres')
      .matches(/^[a-zA-Z0-9]+$/).withMessage('El número de empleado solo puede contener letras y números'),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
      .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número'),
    body('rol')
      .optional()
      .isIn(['empleado', 'admin']).withMessage('Rol inválido')
  ],
  validar,
  register
)

// Login
router.post('/login',
  [
    body('numeroEmpleado')
      .trim()
      .notEmpty().withMessage('El número de empleado es obligatorio'),
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
  ],
  validar,
  login
)

// Me
router.get('/me', authMiddleware, me)

// Cambiar contraseña
router.put('/change-password', authMiddleware,
  [
    body('passwordActual')
      .notEmpty().withMessage('La contraseña actual es obligatoria'),
    body('passwordNueva')
      .notEmpty().withMessage('La contraseña nueva es obligatoria')
      .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
      .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula')
      .matches(/[0-9]/).withMessage('La contraseña debe contener al menos un número')
      .custom(value => {
  const prohibidas = ['12345678', 'password', 'Password1', 'Contraseña1', '87654321']
  if (prohibidas.includes(value)) {
    throw new Error('La contraseña es demasiado común, elige una más segura')
  }
  return true
})
  ],
  validar,
  async (req, res) => {
    try {
      const { passwordActual, passwordNueva } = req.body
      const empleado = await Empleado.findById(req.user.id)
      const valida = await bcrypt.compare(passwordActual, empleado.passwordHash)
      if (!valida) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' })
      }
      empleado.passwordHash = await bcrypt.hash(passwordNueva, 10)
      await empleado.save()
      res.json({ message: 'Contraseña actualizada correctamente' })
    } catch (err) {
      res.status(500).json({ error: 'Error al cambiar contraseña' })
    }
  }
)

module.exports = router
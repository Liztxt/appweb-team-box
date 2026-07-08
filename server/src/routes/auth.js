const crypto = require('crypto')
const { Resend } = require('resend')
const TokenRecuperacion = require('../models/TokenRecuperacion')
const resend = new Resend(process.env.RESEND_API_KEY)
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

// Solicitar recuperación de contraseña
router.post('/forgot-password',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('El email es obligatorio')
      .isEmail().withMessage('Email inválido')
  ],
  validar,
  async (req, res) => {
    try {
      const { email } = req.body
      const empleado = await Empleado.findOne({ email })

      // Siempre responde igual para no revelar si el email existe
      if (!empleado) {
        return res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' })
      }

      // Eliminar tokens anteriores
      await TokenRecuperacion.deleteMany({ empleadoId: empleado._id })

      // Crear token nuevo
      const token = crypto.randomBytes(32).toString('hex')
      const expira = new Date(Date.now() + 60 * 60 * 1000) // 1 hora

      await TokenRecuperacion.create({ empleadoId: empleado._id, token, expira })

      const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

      await resend.emails.send({
        from: 'Team Box <onboarding@resend.dev>',
        to: email,
        subject: 'Recuperación de contraseña — Team Box',
        html: `
          <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1E293B;">Team Box</h2>
            <p style="color: #64748B;">Recibimos una solicitud para restablecer tu contraseña.</p>
            <a href="${link}" style="display: inline-block; background: #6366F1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">
              Restablecer contraseña
            </a>
            <p style="color: #94A3B8; font-size: 12px; margin-top: 24px;">Este enlace expira en 1 hora. Si no solicitaste esto, ignora este mensaje.</p>
          </div>
        `
      })

      res.json({ message: 'Si el email existe, recibirás un enlace de recuperación' })
    } catch (err) {
      console.log('Error forgot-password:', err)
      res.status(500).json({ error: 'Error al procesar solicitud' })
    }
  }
)

// Restablecer contraseña con token
router.post('/reset-password',
  [
    body('token').notEmpty().withMessage('Token inválido'),
    body('passwordNueva')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
      .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
      .matches(/[0-9]/).withMessage('Debe contener al menos un número')
  ],
  validar,
  async (req, res) => {
    try {
      const { token, passwordNueva } = req.body

      const tokenDoc = await TokenRecuperacion.findOne({ token })

      if (!tokenDoc || tokenDoc.expira < new Date()) {
        await TokenRecuperacion.deleteMany({ token })
        return res.status(400).json({ error: 'Token inválido o expirado' })
      }

      const passwordHash = await bcrypt.hash(passwordNueva, 10)
      await Empleado.findByIdAndUpdate(tokenDoc.empleadoId, { passwordHash })
      await TokenRecuperacion.deleteMany({ empleadoId: tokenDoc.empleadoId })

      res.json({ message: 'Contraseña restablecida correctamente' })
    } catch (err) {
      res.status(500).json({ error: 'Error al restablecer contraseña' })
    }
  }
)

module.exports = router
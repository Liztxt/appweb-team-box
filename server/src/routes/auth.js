const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { register, login, me } = require('../controllers/authController')
const authMiddleware = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/me', authMiddleware, me)
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body

    if (!passwordNueva || passwordNueva.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
    }

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
})

module.exports = router
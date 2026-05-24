const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Empleado = require('../models/Empleado')

const register = async (req, res) => {
  try {
    const { numeroEmpleado, password, rol } = req.body

    const existe = await Empleado.findOne({ numeroEmpleado })
    if (existe) {
      return res.status(400).json({ error: 'Número de empleado ya registrado' })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const empleado = new Empleado({ numeroEmpleado, passwordHash, rol })
    await empleado.save()

    res.status(201).json({ message: 'Empleado creado correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error al crear empleado' })
  }
}

const login = async (req, res) => {
  try {
    const { numeroEmpleado, password } = req.body

    const empleado = await Empleado.findOne({ numeroEmpleado })
    if (!empleado) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const passwordValida = await bcrypt.compare(password, empleado.passwordHash)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' })
    }

    const token = jwt.sign(
      { id: empleado._id, numeroEmpleado: empleado.numeroEmpleado, rol: empleado.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({ token, rol: empleado.rol, numeroEmpleado: empleado.numeroEmpleado })
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

const me = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.user.id).select('-passwordHash').populate('equipos')
    res.json(empleado)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
}

module.exports = { register, login, me }
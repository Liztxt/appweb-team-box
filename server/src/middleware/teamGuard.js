const Empleado = require('../models/Empleado')

const teamGuard = async (req, res, next) => {
  try {
    if (req.user.rol === 'admin') return next()

    const teamId = req.params.teamId
    const empleado = await Empleado.findById(req.user.id).select('equipos')

    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' })
    }

    const pertenece = empleado.equipos.some(
      (e) => e.toString() === teamId
    )

    if (!pertenece) {
      return res.status(403).json({ error: 'No tienes acceso a este equipo' })
    }

    next()
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar acceso' })
  }
}

module.exports = teamGuard
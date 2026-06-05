const Equipo = require('../models/Equipo')
const Empleado = require('../models/Empleado')

// Crear equipo (solo admin)
const crearEquipo = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear equipos' })
    }

    const { nombre, descripcion } = req.body
    const equipo = new Equipo({ nombre, descripcion })
    await equipo.save()

    res.status(201).json(equipo)
  } catch (err) {
    res.status(500).json({ error: 'Error al crear equipo' })
  }
}

// Asignar empleado a equipo (solo admin)
const asignarEmpleado = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden asignar empleados' })
    }

    const { equipoId, numeroEmpleado } = req.body

    const equipo = await Equipo.findById(equipoId)
    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' })
    }

    const empleado = await Empleado.findOne({ numeroEmpleado })
    if (!empleado) {
      return res.status(404).json({ error: 'Empleado no encontrado' })
    }

    if (empleado.equipos.includes(equipoId)) {
      return res.status(400).json({ error: 'El empleado ya pertenece a este equipo' })
    }

    empleado.equipos.push(equipoId)
    await empleado.save()

    res.json({ message: 'Empleado asignado correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error al asignar empleado' })
  }
}

// Ver mis equipos
const misEquipos = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.user.id).populate('equipos')
    res.json(empleado.equipos)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener equipos' })
  }
}

// Ver un equipo específico (protegido por teamGuard)
const verEquipo = async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.teamId)
    res.json(equipo)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener equipo' })
  }
}
const eliminarEquipo = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden eliminar equipos' })
    }
    await Equipo.findByIdAndDelete(req.params.equipoId)
    res.json({ message: 'Equipo eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar equipo' })
  }
}
module.exports = { crearEquipo, asignarEmpleado, misEquipos, verEquipo, eliminarEquipo }
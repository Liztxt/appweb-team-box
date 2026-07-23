const Equipo = require('../models/Equipo')
const Empleado = require('../models/Empleado')

const crearEquipo = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden crear equipos' })
    }

    const { nombre, descripcion } = req.body

    // Verificar si ya existe un equipo con ese nombre
    const equipoExistente = await Equipo.findOne({ nombre: nombre.trim() })
    if (equipoExistente) {
      return res.status(400).json({ error: 'Ya existe un equipo con ese nombre' })
    }

    const equipo = new Equipo({ nombre: nombre.trim(), descripcion, creadoPor: req.user.id })
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

const verEquipo = async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.teamId)
    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' })
    }

    const miembros = await Empleado.find({ equipos: req.params.teamId }).select('-passwordHash')
    res.json({ ...equipo.toObject(), miembros })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener equipo' })
  }
}

const eliminarEquipo = async (req, res) => {
  try {
    if (req.user.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden eliminar equipos' })
    }
    const equipo = await Equipo.findByIdAndDelete(req.params.equipoId)
    if (!equipo) {
      return res.status(404).json({ error: 'Equipo no encontrado' })
    }
    await Empleado.updateMany(
      { equipos: req.params.equipoId },
      { $pull: { equipos: req.params.equipoId } }
    )
    res.json({ message: 'Equipo eliminado' })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar equipo' })
  }
}
module.exports = { crearEquipo, asignarEmpleado, misEquipos, verEquipo, eliminarEquipo }
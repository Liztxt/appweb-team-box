const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const Empleado = require('../models/Empleado')
const Equipo = require('../models/Equipo')
const Documento = require('../models/Documento')
const registrarLog = require('../middleware/logger')

router.use(authMiddleware)

// Verificar que sea manager o admin
router.use((req, res, next) => {
  if (req.user.rol !== 'manager' && req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' })
  }
  next()
})

// Ver sus propios equipos
router.get('/mis-equipos', async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.user.id).populate('equipos')
    res.json(empleado.equipos)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener equipos' })
  }
})

// Crear equipo
router.post('/equipos', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

    const equipoExistente = await Equipo.findOne({ nombre: nombre.trim() })
    if (equipoExistente) return res.status(400).json({ error: 'Ya existe un equipo con ese nombre' })

    const equipo = new Equipo({ nombre: nombre.trim(), descripcion })
    await equipo.save()

    // Asignarse automáticamente al equipo
    await Empleado.findByIdAndUpdate(req.user.id, { $push: { equipos: equipo._id } })

    await registrarLog({
      empleadoId: req.user.id,
      numeroEmpleado: req.user.numeroEmpleado,
      accion: 'CREAR_EQUIPO',
      detalle: `Manager creó el equipo "${nombre}"`,
      ip: req.ip,
      exitoso: true
    })

    res.status(201).json(equipo)
  } catch (err) {
    res.status(500).json({ error: 'Error al crear equipo' })
  }
})

// Ver empleados disponibles para asignar
router.get('/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find({ rol: 'empleado' }).select('-passwordHash')
    res.json(empleados)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener empleados' })
  }
})

// Asignar empleado a uno de sus equipos
router.post('/equipos', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

    const equipoExistente = await Equipo.findOne({ nombre: nombre.trim() })
    if (equipoExistente) return res.status(400).json({ error: 'Ya existe un equipo con ese nombre' })

    const equipo = new Equipo({ nombre: nombre.trim(), descripcion, creadoPor: req.user.id })
    await equipo.save()

    await Empleado.findByIdAndUpdate(req.user.id, { $push: { equipos: equipo._id } })

    await registrarLog({
      empleadoId: req.user.id,
      numeroEmpleado: req.user.numeroEmpleado,
      accion: 'CREAR_EQUIPO',
      detalle: `Manager creó el equipo "${nombre}"`,
      ip: req.ip,
      exitoso: true
    })

    res.status(201).json(equipo)
  } catch (err) {
    res.status(500).json({ error: 'Error al crear equipo' })
  }
})

// Quitar miembro de uno de sus equipos
router.delete('/equipos/:equipoId/miembro/:empleadoId', async (req, res) => {
  try {
    const manager = await Empleado.findById(req.user.id)
    if (!manager.equipos.some(e => e.toString() === req.params.equipoId)) {
      return res.status(403).json({ error: 'No tienes acceso a este equipo' })
    }

    const empleado = await Empleado.findByIdAndUpdate(
      req.params.empleadoId,
      { $pull: { equipos: req.params.equipoId } },
      { new: true }
    )
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' })

    res.json({ message: 'Miembro removido correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error al remover miembro' })
  }
})

// Stats del manager
router.get('/stats', async (req, res) => {
  try {
    const manager = await Empleado.findById(req.user.id)
    const totalEquipos = manager.equipos.length
    const totalDocs = await Documento.countDocuments({ equipoId: { $in: manager.equipos } })
    const totalMiembros = await Empleado.countDocuments({ equipos: { $in: manager.equipos } })
    res.json({ totalEquipos, totalDocs, totalMiembros })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener stats' })
  }
})

// Ver detalle de equipo con miembros
router.get('/equipos/:equipoId', async (req, res) => {
  try {
    const equipo = await Equipo.findOne({
      _id: req.params.equipoId,
      creadoPor: req.user.id
    })
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado o sin permisos' })

    const miembros = await Empleado.find({ equipos: req.params.equipoId }).select('-passwordHash')
    res.json({ ...equipo.toObject(), miembros })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener equipo' })
  }
})

// Editar equipo (solo si lo creó)
router.put('/equipos/:equipoId', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })

    const equipo = await Equipo.findOneAndUpdate(
      { _id: req.params.equipoId, creadoPor: req.user.id },
      { nombre: nombre.trim(), descripcion },
      { new: true }
    )
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado o sin permisos' })

    res.json(equipo)
  } catch (err) {
    res.status(500).json({ error: 'Error al editar equipo' })
  }
})

module.exports = router
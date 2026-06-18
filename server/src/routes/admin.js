const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const Empleado = require('../models/Empleado')
const Equipo = require('../models/Equipo')
const Documento = require('../models/Documento')
const Log = require('../models/Log')
const registrarLog = require('../middleware/logger')
const bcrypt = require('bcrypt')

router.use(authMiddleware)

router.put('/empleados/:id/password', async (req, res) => {
  try {
    const { passwordNueva } = req.body
    if (!passwordNueva || passwordNueva.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' })
    }
    const passwordHash = await bcrypt.hash(passwordNueva, 10)
    const empleado = await Empleado.findByIdAndUpdate(req.params.id, { passwordHash })
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' })
    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error al cambiar contraseña' })
  }
})
router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ fecha: -1 }).limit(50)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener logs' })
  }
})

router.get('/empleados', async (req, res) => {
  try {
    const empleados = await Empleado.find().select('-passwordHash')
    res.json(empleados)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener empleados' })
  }
})

router.get('/stats/equipos', async (req, res) => {
  try {
    const total = await Equipo.countDocuments()
    const totalDocs = await Documento.countDocuments()
    res.json({ total, totalDocs })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener stats' })
  }
})

router.get('/stats/empleados', async (req, res) => {
  try {
    const total = await Empleado.countDocuments()
    res.json({ total })
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener stats' })
  }
})

router.get('/equipos', async (req, res) => {
  try {
    const equipos = await Equipo.find()
    res.json(equipos)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener equipos' })
  }
})

router.get('/documentos', async (req, res) => {
  try {
    const documentos = await Documento.find().select('-archivo').sort({ creadoEn: -1 })
    res.json(documentos)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener documentos' })
  }
})

// Eliminar empleado
router.delete('/empleados/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndDelete(req.params.id)
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' })
    await registrarLog({
      empleadoId: req.user.id,
      numeroEmpleado: req.user.numeroEmpleado,
      accion: 'ELIMINAR_EMPLEADO',
      detalle: `Eliminó al empleado #${empleado.numeroEmpleado}`,
      ip: req.ip,
      exitoso: true
    })
    res.json({ message: 'Empleado eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar empleado' })
  }
})

// Modificar rol de empleado
router.put('/empleados/:id', async (req, res) => {
  try {
    const { rol } = req.body
    if (!['empleado', 'admin'].includes(rol)) {
      return res.status(400).json({ error: 'Rol inválido' })
    }
    const empleado = await Empleado.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true }
    ).select('-passwordHash')
    if (!empleado) return res.status(404).json({ error: 'Empleado no encontrado' })
    res.json(empleado)
  } catch (err) {
    res.status(500).json({ error: 'Error al modificar empleado' })
  }
})

// Eliminar equipo
router.delete('/equipos/:id', async (req, res) => {
  try {
    const equipo = await Equipo.findByIdAndDelete(req.params.id)
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' })
    await Empleado.updateMany(
      { equipos: req.params.id },
      { $pull: { equipos: req.params.id } }
    )
    await registrarLog({
      empleadoId: req.user.id,
      numeroEmpleado: req.user.numeroEmpleado,
      accion: 'ELIMINAR_EQUIPO',
      detalle: `Eliminó el equipo "${equipo.nombre}"`,
      ip: req.ip,
      exitoso: true
    })
    res.json({ message: 'Equipo eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar equipo' })
  }
})

// Modificar equipo
router.put('/equipos/:id', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body
    if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' })
    const equipo = await Equipo.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion },
      { new: true }
    )
    if (!equipo) return res.status(404).json({ error: 'Equipo no encontrado' })
    res.json(equipo)
  } catch (err) {
    res.status(500).json({ error: 'Error al modificar equipo' })
  }
})

// Quitar miembro de equipo
router.delete('/equipos/:equipoId/miembro/:empleadoId', async (req, res) => {
  try {
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

module.exports = router
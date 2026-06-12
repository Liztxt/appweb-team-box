const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const Empleado = require('../models/Empleado')
const Equipo = require('../models/Equipo')
const Documento = require('../models/Documento')
const Log = require('../models/Log')

router.get('/logs', async (req, res) => {
  try {
    const logs = await Log.find()
      .sort({ fecha: -1 })
      .limit(50)
    res.json(logs)
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener logs' })
  }
})

router.use(authMiddleware)

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

module.exports = router
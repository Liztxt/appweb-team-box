const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth')
const teamGuard = require('../middleware/teamGuard')
const {
  crearEquipo,
  asignarEmpleado,
  misEquipos,
  verEquipo,
  eliminarEquipo
} = require('../controllers/equipoController')

// Todas requieren estar logueado
router.use(authMiddleware)

router.post('/', crearEquipo)
router.post('/asignar', asignarEmpleado)
router.get('/mine', misEquipos)
router.get('/:teamId', teamGuard, verEquipo)
router.delete('/:equipoId', eliminarEquipo)

module.exports = router
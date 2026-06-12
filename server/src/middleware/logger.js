const Log = require('../models/Log')

const registrarLog = async ({ empleadoId, numeroEmpleado, accion, detalle, ip, exitoso = true }) => {
  try {
    await Log.create({ empleadoId, numeroEmpleado, accion, detalle, ip, exitoso })
  } catch (err) {
    console.log('Error al registrar log:', err)
  }
}

module.exports = registrarLog
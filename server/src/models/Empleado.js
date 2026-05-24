const mongoose = require('mongoose')

const empleadoSchema = new mongoose.Schema({
  numeroEmpleado: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  equipos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' }],
  rol: { type: String, enum: ['empleado', 'admin'], default: 'empleado' }
})

module.exports = mongoose.model('Empleado', empleadoSchema)
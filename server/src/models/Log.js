const mongoose = require('mongoose')

const logSchema = new mongoose.Schema({
  empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
  numeroEmpleado: { type: String },
  accion: { type: String, required: true },
  detalle: { type: String },
  ip: { type: String },
  exitoso: { type: Boolean, default: true },
  fecha: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Log', logSchema)
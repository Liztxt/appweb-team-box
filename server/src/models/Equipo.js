const mongoose = require('mongoose')

const equipoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  creadoEn: { type: Date, default: Date.now },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', default: null }
})

module.exports = mongoose.model('Equipo', equipoSchema)
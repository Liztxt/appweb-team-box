const mongoose = require('mongoose')

const tokenRecuperacionSchema = new mongoose.Schema({
  empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado', required: true },
  token: { type: String, required: true },
  expira: { type: Date, required: true }
})

module.exports = mongoose.model('TokenRecuperacion', tokenRecuperacionSchema)
const mongoose = require('mongoose')

const documentoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  tipo: { type: String, enum: ['documento', 'plantilla'], required: true },
  archivo: { type: Buffer },
  archivoNombre: { type: String },
  archivoTipo: { type: String },
  equipoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  creadoEn: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Documento', documentoSchema)
const mongoose = require('mongoose')

const documentoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String },
  tipo: { type: String, enum: ['documento', 'reporte'], required: true },
  archivo: { type: Buffer },
  archivoNombre: { type: String },
  archivoTipo: { type: String },
  // Campos específicos de reporte
  autor: { type: String },
  texto: { type: String },
  fotos: [{ data: Buffer, tipo: String, nombre: String }],
  equipoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  creadoEn: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Documento', documentoSchema)
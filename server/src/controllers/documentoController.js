const Documento = require('../models/Documento')

// Subir documento o plantilla
const subirDocumento = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' })
    }

    const { titulo, descripcion, tipo } = req.body
    const { teamId } = req.params

    if (!titulo || !tipo) {
      return res.status(400).json({ error: 'Título y tipo son requeridos' })
    }

    if (!['documento', 'plantilla'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo debe ser documento o plantilla' })
    }

    const documento = new Documento({
      titulo,
      descripcion,
      tipo,
      archivo: req.file.buffer,
      archivoNombre: req.file.originalname,
      archivoTipo: req.file.mimetype,
      equipoId: teamId
    })

    await documento.save()

    res.status(201).json({
      message: 'Archivo subido correctamente',
      documento: {
        _id: documento._id,
        titulo: documento.titulo,
        descripcion: documento.descripcion,
        tipo: documento.tipo,
        archivoNombre: documento.archivoNombre,
        archivoTipo: documento.archivoTipo,
        equipoId: documento.equipoId,
        creadoEn: documento.creadoEn
      }
    })
  } catch (err) {
    console.log('Error al subir:', err)
    res.status(500).json({ error: 'Error al subir archivo' })
  }
}

// Listar documentos de un equipo
const listarDocumentos = async (req, res) => {
  try {
    const { teamId } = req.params
    const { tipo } = req.query

    const filtro = { equipoId: teamId }
    if (tipo) filtro.tipo = tipo

    const documentos = await Documento.find(filtro)
      .select('-archivo')
      .sort({ creadoEn: -1 })

    res.json(documentos)
  } catch (err) {
    res.status(500).json({ error: 'Error al listar documentos' })
  }
}

// Descargar un documento
const descargarDocumento = async (req, res) => {
  try {
    const documento = await Documento.findOne({
      _id: req.params.docId,
      equipoId: req.params.teamId
    })

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' })
    }

    res.set({
      'Content-Type': documento.archivoTipo,
      'Content-Disposition': `attachment; filename="${documento.archivoNombre}"`
    })

    res.send(documento.archivo)
  } catch (err) {
    res.status(500).json({ error: 'Error al descargar documento' })
  }
}

// Eliminar un documento
const eliminarDocumento = async (req, res) => {
  try {
    const documento = await Documento.findOneAndDelete({
      _id: req.params.docId,
      equipoId: req.params.teamId
    })

    if (!documento) {
      return res.status(404).json({ error: 'Documento no encontrado' })
    }

    res.json({ message: 'Documento eliminado correctamente' })
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar documento' })
  }
}

module.exports = { subirDocumento, listarDocumentos, descargarDocumento, eliminarDocumento }
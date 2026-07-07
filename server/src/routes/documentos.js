const express = require('express')
const router = express.Router({ mergeParams: true })
const multer = require('multer')
const authMiddleware = require('../middleware/auth')
const teamGuard = require('../middleware/teamGuard')
const { body, validationResult } = require('express-validator')

const validar = (req, res, next) => {
  const errores = validationResult(req)
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: errores.array()[0].msg })
  }
  next()
}
const {
  subirDocumento,
  listarDocumentos,
  descargarDocumento,
  eliminarDocumento,
  previsualizarDocumento,
  editarDocumento
} = require('../controllers/documentoController')

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

router.use(authMiddleware)
router.use(teamGuard)

router.get('/', listarDocumentos)
router.get('/:docId/download', descargarDocumento)
router.get('/:docId/preview', previsualizarDocumento)
router.delete('/:docId', eliminarDocumento)
router.put('/:docId',
  upload.single('archivo'),
  [
    body('titulo')
      .optional()
      .trim()
      .notEmpty().withMessage('El título no puede estar vacío')
      .isLength({ max: 100 }).withMessage('El título no puede exceder 100 caracteres')
      .escape(),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 300 }).withMessage('La descripción no puede exceder 300 caracteres')
      .escape(),
    body('tipo')
      .optional()
      .isIn(['documento', 'plantilla']).withMessage('Tipo inválido')
  ],
  validar,
  editarDocumento
)
router.post('/',
  upload.single('archivo'),
  [
    body('titulo')
      .trim()
      .notEmpty().withMessage('El título es obligatorio')
      .isLength({ max: 100 }).withMessage('El título no puede exceder 100 caracteres')
      .escape(),
    body('descripcion')
      .optional()
      .trim()
      .isLength({ max: 300 }).withMessage('La descripción no puede exceder 300 caracteres')
      .escape(),
    body('tipo')
      .notEmpty().withMessage('El tipo es obligatorio')
      .isIn(['documento', 'plantilla']).withMessage('Tipo inválido')
  ],
  validar,
  subirDocumento
)
// Editar documento
const editarDocumento = async (req, res) => {
  try {
    const { titulo, descripcion, tipo } = req.body

    const actualizar = {}
    if (titulo) actualizar.titulo = titulo
    if (descripcion !== undefined) actualizar.descripcion = descripcion
    if (tipo) actualizar.tipo = tipo

    if (req.file) {
      actualizar.archivo = req.file.buffer
      actualizar.archivoNombre = req.file.originalname
      actualizar.archivoTipo = req.file.mimetype
    }

    const documento = await Documento.findOneAndUpdate(
      { _id: req.params.docId, equipoId: req.params.teamId },
      actualizar,
      { new: true }
    ).select('-archivo')

    if (!documento) return res.status(404).json({ error: 'Documento no encontrado' })

    await registrarLog({
      empleadoId: req.user.id,
      numeroEmpleado: req.user.numeroEmpleado,
      accion: 'EDITAR_DOCUMENTO',
      detalle: `Editó el documento "${documento.titulo}"`,
      ip: req.ip,
      exitoso: true
    })

    res.json(documento)
  } catch (err) {
    res.status(500).json({ error: 'Error al editar documento' })
  }
}
module.exports = { subirDocumento, listarDocumentos, descargarDocumento, eliminarDocumento, previsualizarDocumento, editarDocumento }
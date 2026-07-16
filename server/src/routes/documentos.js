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
  editarDocumento,
  verFotoReporte
} = require('../controllers/documentoController')

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

router.use(authMiddleware)
router.use(teamGuard)

router.get('/', listarDocumentos)
router.get('/:docId/download', descargarDocumento)
router.get('/:docId/preview', previsualizarDocumento)
router.get('/:docId/foto/:indice', verFotoReporte)
router.delete('/:docId', eliminarDocumento)

router.put('/:docId',
  upload.single('archivo'),
  [
    body('titulo').optional().trim().notEmpty().withMessage('El título no puede estar vacío')
      .isLength({ max: 100 }).withMessage('El título no puede exceder 100 caracteres').escape(),
    body('descripcion').optional().trim()
      .isLength({ max: 300 }).withMessage('La descripción no puede exceder 300 caracteres').escape(),
    body('tipo').optional().isIn(['documento', 'reporte']).withMessage('Tipo inválido')
  ],
  validar,
  editarDocumento
)

router.post('/',
  upload.fields([
    { name: 'archivo', maxCount: 1 },
    { name: 'fotos', maxCount: 4 }
  ]),
  [
    body('titulo').trim().notEmpty().withMessage('El título es obligatorio')
      .isLength({ max: 100 }).withMessage('El título no puede exceder 100 caracteres').escape(),
    body('descripcion').optional().trim()
      .isLength({ max: 300 }).withMessage('La descripción no puede exceder 300 caracteres').escape(),
    body('tipo').notEmpty().withMessage('El tipo es obligatorio')
      .isIn(['documento', 'reporte']).withMessage('Tipo inválido')
  ],
  validar,
  (req, res, next) => {
    if (req.files?.archivo) {
      req.file = req.files.archivo[0]
    }
    if (req.files?.fotos) {
      req.files = req.files.fotos
    }
    next()
  },
  subirDocumento
)

module.exports = router
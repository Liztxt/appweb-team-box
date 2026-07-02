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
  previsualizarDocumento
} = require('../controllers/documentoController')

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

router.use(authMiddleware)
router.use(teamGuard)

router.get('/', listarDocumentos)
router.get('/:docId/download', descargarDocumento)
router.get('/:docId/preview', previsualizarDocumento)
router.delete('/:docId', eliminarDocumento)
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

module.exports = router
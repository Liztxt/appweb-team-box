const express = require('express')
const router = express.Router({ mergeParams: true })
const multer = require('multer')
const authMiddleware = require('../middleware/auth')
const teamGuard = require('../middleware/teamGuard')
const {
  subirDocumento,
  listarDocumentos,
  descargarDocumento,
  eliminarDocumento
} = require('../controllers/documentoController')

const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

router.use(authMiddleware)
router.use(teamGuard)

router.get('/', listarDocumentos)
router.post('/', upload.single('archivo'), subirDocumento)
router.get('/:docId/download', descargarDocumento)
router.delete('/:docId', eliminarDocumento)

module.exports = router
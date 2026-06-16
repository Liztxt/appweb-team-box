const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const helmet = require('helmet')


dotenv.config()

const app = express()
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://team-box-client.onrender.com'
  ],
  credentials: true
}))
app.use(express.json())
app.use(helmet())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Atlas conectado'))
  .catch((err) => console.log('Error de conexión:', err))

app.use('/auth', require('./routes/auth'))
app.use('/teams', require('./routes/equipos'))
app.use('/teams/:teamId/docs', require('./routes/documentos'))
app.use('/admin', require('./routes/admin'))

app.get('/', (req, res) => {
  res.json({ message: 'Team Box API corriendo' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Empleado = require('./src/models/Empleado')

const NUMERO_EMPLEADO = '00001'
const PASSWORD = 'Admin1234'

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB conectado')

    const existe = await Empleado.findOne({ numeroEmpleado: NUMERO_EMPLEADO })
    if (existe) {
      console.log(`⚠️  Ya existe un empleado con número ${NUMERO_EMPLEADO}`)
      process.exit(0)
    }

    const passwordHash = await bcrypt.hash(PASSWORD, 10)
    const admin = new Empleado({
      numeroEmpleado: NUMERO_EMPLEADO,
      passwordHash,
      rol: 'admin'
    })

    await admin.save()
    console.log('✅ Admin creado exitosamente')
    console.log(`   Número de empleado: ${NUMERO_EMPLEADO}`)
    console.log(`   Contraseña: ${PASSWORD}`)
    console.log('   ⚠️  Cambia la contraseña después del primer login')
    process.exit(0)
  } catch (err) {
    console.error('Error:', err)
    process.exit(1)
  }
}

seed()
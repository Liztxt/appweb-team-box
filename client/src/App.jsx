import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import MisEquipos from './pages/MisEquipos'
import Documentos from './pages/Documentos'
import DetalleDocumento from './pages/DetalleDocumento'
import SubirDocumento from './pages/SubirDocumento'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/admin/Dashboard'
import Empleados from './pages/admin/Empleados'
import Equipos from './pages/admin/Equipos'
import Perfil from './pages/Perfil'
import VerEquipos from './pages/admin/VerEquipos'
import NotFound from './pages/NotFound'
import VerEmpleados from './pages/admin/VerEmpleados'
import PerfilEmpleado from './pages/admin/PerfilEmpleado'
import VerDocumentos from './pages/admin/VerDocumentos'
import DetalleEquipoAdmin from './pages/admin/DetalleEquipoAdmin'



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/equipos' element={<ProtectedRoute><MisEquipos /></ProtectedRoute>} />
        <Route path='/equipos/:teamId/docs' element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
        <Route path='/equipos/:teamId/docs/:docId' element={<ProtectedRoute><DetalleDocumento /></ProtectedRoute>} />
        <Route path='/equipos/:teamId/docs/subir' element={<ProtectedRoute><SubirDocumento /></ProtectedRoute>} />
        <Route path='/admin' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/admin/empleados' element={<ProtectedRoute><Empleados /></ProtectedRoute>} />
        <Route path='/admin/equipos' element={<ProtectedRoute><Equipos /></ProtectedRoute>} />
        <Route path='/perfil' element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path='/admin/ver/equipos' element={<ProtectedRoute><VerEquipos /></ProtectedRoute>} />
<Route path='/admin/ver/empleados' element={<ProtectedRoute><VerEmpleados /></ProtectedRoute>} />
<Route path="/admin/ver/empleados/:id" element={<PerfilEmpleado />} />
<Route path='/admin/ver/documentos' element={<ProtectedRoute><VerDocumentos /></ProtectedRoute>} />
<Route path="/admin/ver/equipos/:id" element={<DetalleEquipoAdmin />} />

<Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
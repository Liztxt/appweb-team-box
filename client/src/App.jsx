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
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  )
}
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import MisEquipos from './pages/MisEquipos'
import Documentos from './pages/Documentos'
import DetalleDocumento from './pages/DetalleDocumento'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/equipos' element={<ProtectedRoute><MisEquipos /></ProtectedRoute>} />
        <Route path='/equipos/:teamId/docs' element={<ProtectedRoute><Documentos /></ProtectedRoute>} />
        <Route path='/equipos/:teamId/docs/:docId' element={<ProtectedRoute><DetalleDocumento /></ProtectedRoute>} />
        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  )
}
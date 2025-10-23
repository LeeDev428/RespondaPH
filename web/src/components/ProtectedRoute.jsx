import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lgu-green-600 text-xl">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/resident/dashboard'} />
  }

  return children
}

export default ProtectedRoute

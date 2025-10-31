import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData)
      login(response.data.token, response.data.user)
      
      // Redirect based on role
      if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/resident/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lgu-green-50 to-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-lgu-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl">D</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
            <p className="text-gray-600 mt-2">Access your DREAM account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lgu-green-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-lgu-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lgu-green-600 text-white py-3 rounded-lg font-semibold hover:bg-lgu-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-lgu-green-600 font-semibold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Login

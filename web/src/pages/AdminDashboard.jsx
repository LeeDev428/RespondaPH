import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} />
      
      <div className="flex-grow flex">
        {/* Sidebar */}
        <aside className="w-64 bg-lgu-green-800 text-white">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <nav className="space-y-2">
              <a
                href="#"
                className="block px-4 py-3 bg-lgu-green-700 rounded-lg hover:bg-lgu-green-600 transition"
              >
                📊 Dashboard
              </a>
              <a
                href="#"
                className="block px-4 py-3 rounded-lg hover:bg-lgu-green-700 transition"
              >
                📋 Reports
              </a>
              <a
                href="#"
                className="block px-4 py-3 rounded-lg hover:bg-lgu-green-700 transition"
              >
                👥 Residents
              </a>
              <a
                href="#"
                className="block px-4 py-3 rounded-lg hover:bg-lgu-green-700 transition"
              >
                ⚠️ Emergencies
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-600 transition mt-4"
              >
                🚪 Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              Welcome back, {user?.name}!
            </p>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-2">📊</div>
                <h3 className="text-gray-600 text-sm font-medium">Total Reports</h3>
                <p className="text-3xl font-bold text-lgu-green-600">0</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-2">👥</div>
                <h3 className="text-gray-600 text-sm font-medium">Registered Residents</h3>
                <p className="text-3xl font-bold text-lgu-green-600">0</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-2">⚠️</div>
                <h3 className="text-gray-600 text-sm font-medium">Active Emergencies</h3>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-gray-600 text-sm font-medium">Resolved Today</h3>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
            </div>

            {/* Recent Reports Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Reports</h2>
              <div className="text-center py-12 text-gray-500">
                No reports yet. Reports will appear here once residents start reporting incidents.
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default AdminDashboard

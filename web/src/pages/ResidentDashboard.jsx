import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const ResidentDashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lgu-green-50 to-white">
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resident Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome, {user?.name}! Manage your emergency reports and stay updated.
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <button className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition text-left border-2 border-lgu-green-200 hover:border-lgu-green-400">
              <div className="text-5xl mb-4">🚨</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Report Emergency
              </h3>
              <p className="text-gray-600">
                Submit a new emergency report to the barangay
              </p>
            </button>

            <button className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition text-left border-2 border-lgu-green-200 hover:border-lgu-green-400">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                My Reports
              </h3>
              <p className="text-gray-600">
                View and track your submitted reports
              </p>
            </button>

            <button className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition text-left border-2 border-lgu-green-200 hover:border-lgu-green-400">
              <div className="text-5xl mb-4">📢</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                View Alerts
              </h3>
              <p className="text-gray-600">
                Check emergency alerts and announcements
              </p>
            </button>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">📭</div>
              <p>No activity yet. Your reports and updates will appear here.</p>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Emergency Hotlines
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-semibold">National Emergency:</p>
                <p className="text-2xl font-bold text-red-600">911</p>
              </div>
              <div>
                <p className="font-semibold">Barangay Office:</p>
                <p className="text-2xl font-bold text-red-600">(123) 456-7890</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ResidentDashboard

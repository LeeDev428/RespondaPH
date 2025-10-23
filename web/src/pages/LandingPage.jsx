import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-lgu-green-50 to-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-lgu-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-4xl">T</span>
              </div>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Tugon
            </h1>
            <p className="text-2xl text-lgu-green-700 mb-2">
              Barangay Disaster Response System
            </p>
            <p className="text-lg text-gray-600 mb-8">
              San Isidro Labrador I
            </p>
            
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
              A comprehensive emergency management platform designed to connect residents 
              with local authorities during disasters and emergencies. Report incidents, 
              receive alerts, and access critical information when you need it most.
            </p>

            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="bg-lgu-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-lgu-green-700 transition shadow-md"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-lgu-green-600 border-2 border-lgu-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-lgu-green-50 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border-2 border-lgu-green-200 hover:shadow-lg transition">
                <div className="text-4xl mb-4">🚨</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Emergency Reporting
                </h3>
                <p className="text-gray-600">
                  Quick and easy incident reporting system for residents
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg border-2 border-lgu-green-200 hover:shadow-lg transition">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Real-time Alerts
                </h3>
                <p className="text-gray-600">
                  Receive instant notifications about emergencies in your area
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg border-2 border-lgu-green-200 hover:shadow-lg transition">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Admin Dashboard
                </h3>
                <p className="text-gray-600">
                  Comprehensive management tools for barangay officials
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage

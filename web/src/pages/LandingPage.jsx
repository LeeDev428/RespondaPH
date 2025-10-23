import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-lgu-green-50 via-white to-lgu-green-50">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-lgu-green-500 to-lgu-green-600 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-6xl">T</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Tugon
            </h1>
            <p className="text-2xl text-lgu-green-600 font-semibold mb-2">
              Barangay Disaster Response System
            </p>
            <p className="text-lg text-gray-500 mb-10">
              San Isidro Labrador I
            </p>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Connect with local authorities during disasters and emergencies. 
              Report incidents and receive real-time alerts to stay safe and informed.
            </p>

            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="bg-lgu-green-500 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-lgu-green-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-lgu-green-500 border-2 border-lgu-green-500 px-10 py-4 rounded-xl text-lg font-bold hover:bg-lgu-green-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
              Key Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl bg-red-50 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-5xl mb-6">🆘</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Emergency Reporting
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Quick and easy incident reporting system for residents
                </p>
              </div>
              
              <div className="text-center p-8 rounded-2xl bg-blue-50 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-5xl mb-6">�</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Real-time Alerts
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive instant notifications about emergencies in your area
                </p>
              </div>
              
              <div className="text-center p-8 rounded-2xl bg-yellow-50 hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-5xl mb-6">�</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Track Reports
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your emergency reports and status updates
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

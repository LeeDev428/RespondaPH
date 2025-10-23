import { Link } from 'react-router-dom'

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-lgu-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-lgu-green-700 font-bold text-xl">T</span>
            </div>
            <span className="font-bold text-xl">Tugon</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm">Hello, {user.name}</span>
                <button
                  onClick={onLogout}
                  className="bg-white text-lgu-green-700 px-4 py-2 rounded-lg hover:bg-lgu-green-50 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-lgu-green-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-lgu-green-700 px-4 py-2 rounded-lg hover:bg-lgu-green-50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

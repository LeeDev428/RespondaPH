import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [emergencies, setEmergencies] = useState([])
  const [responders, setResponders] = useState([])
  const [stats, setStats] = useState({})
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedResponders, setSelectedResponders] = useState([])
  const [dispatchEmergencyId, setDispatchEmergencyId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // History filters
  const [historyFilterType, setHistoryFilterType] = useState('all')
  const [historyStartDate, setHistoryStartDate] = useState('')
  const [historyEndDate, setHistoryEndDate] = useState('')
  const [historySortBy, setHistorySortBy] = useState('resolvedDate')
  
  // Forms state
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'general',
    priority: 'medium'
  })
  const [newResponder, setNewResponder] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
    specialization: 'general'
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const config = { headers: { Authorization: `Bearer ${token}` } }
      
      if (activeTab === 'dashboard' || activeTab === 'emergencies' || activeTab === 'history') {
        const [emergenciesRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/emergencies', config),
          axios.get('http://localhost:5000/api/emergencies/stats/dashboard', config)
        ])
        setEmergencies(emergenciesRes.data)
        setStats(statsRes.data)
      }
      
      if (activeTab === 'responders' || activeTab === 'emergencies' || activeTab === 'history') {
        const res = await axios.get('http://localhost:5000/api/responders', config)
        setResponders(res.data)
      }
      
      if (activeTab === 'announcements') {
        const res = await axios.get('http://localhost:5000/api/announcements', config)
        setAnnouncements(res.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      alert(error.response?.data?.message || 'Error fetching data')
    } finally {
      setLoading(false)
    }
  }

  const handleDispatchResponders = async (emergencyId) => {
    if (selectedResponders.length === 0) {
      alert('Please select at least one responder')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:5000/api/emergencies/${emergencyId}`,
        { 
          assignedResponders: selectedResponders,
          status: 'dispatched'
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Responders dispatched successfully!')
      setSelectedResponders([])
      setDispatchEmergencyId(null)
      fetchData()
    } catch (error) {
      console.error('Error dispatching responders:', error)
      alert(error.response?.data?.message || 'Failed to dispatch responders')
    }
  }

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault()
    if (!newAnnouncement.title || !newAnnouncement.message) {
      alert('Please fill in title and message')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:5000/api/announcements',
        newAnnouncement,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Announcement created successfully!')
      setNewAnnouncement({ title: '', message: '', type: 'general', priority: 'medium' })
      fetchData()
    } catch (error) {
      console.error('Error creating announcement:', error)
      alert(error.response?.data?.message || 'Failed to create announcement')
    }
  }

  const handleCreateResponder = async (e) => {
    e.preventDefault()
    if (!newResponder.name || !newResponder.email || !newResponder.phoneNumber || !newResponder.password) {
      alert('Please fill in all fields')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        'http://localhost:5000/api/responders',
        newResponder,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Responder created successfully!')
      setNewResponder({ name: '', email: '', phoneNumber: '', password: '', specialization: 'general' })
      fetchData()
    } catch (error) {
      console.error('Error creating responder:', error)
      alert(error.response?.data?.message || 'Failed to create responder')
    }
  }

  const handleToggleResponder = async (responderId, currentStatus) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `http://localhost:5000/api/responders/${responderId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Responder status updated!')
      fetchData()
    } catch (error) {
      console.error('Error updating responder:', error)
      alert(error.response?.data?.message || 'Failed to update responder')
    }
  }

  const handleDeleteAnnouncement = async (announcementId) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const token = localStorage.getItem('token')
      await axios.delete(
        `http://localhost:5000/api/announcements/${announcementId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Announcement deleted!')
      fetchData()
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert(error.response?.data?.message || 'Failed to delete announcement')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      dispatched: 'bg-blue-100 text-blue-800',
      responding: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800'
  }

  // Analytics data calculations
  const getAnalyticsData = () => {
    const resolvedEmergencies = emergencies.filter(e => e.status === 'resolved')
    
    // Emergency types distribution
    const typeDistribution = resolvedEmergencies.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1
      return acc
    }, {})
    
    const typeChartData = Object.entries(typeDistribution).map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count
    }))
    
    // Monthly trend (last 6 months)
    const monthlyData = {}
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = month.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      monthlyData[monthKey] = 0
    }
    
    resolvedEmergencies.forEach(e => {
      const date = new Date(e.resolvedAt || e.createdAt)
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' })
      if (monthlyData.hasOwnProperty(monthKey)) {
        monthlyData[monthKey]++
      }
    })
    
    const monthlyChartData = Object.entries(monthlyData).map(([month, count]) => ({
      month,
      count
    }))
    
    // Responder statistics
    const responderStats = {}
    resolvedEmergencies.forEach(e => {
      if (e.assignedResponders && e.assignedResponders.length > 0) {
        e.assignedResponders.forEach(r => {
          if (!responderStats[r._id]) {
            responderStats[r._id] = {
              name: r.name,
              count: 0,
              specialization: r.responderDetails?.specialization || 'general'
            }
          }
          responderStats[r._id].count++
        })
      }
    })
    
    const topResponders = Object.values(responderStats)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(r => ({
        name: r.name,
        resolved: r.count,
        specialization: r.specialization
      }))
    
    return { typeChartData, monthlyChartData, topResponders }
  }

  const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout()
      navigate('/login')
    }
  }

  // Format date to Philippine time
  const formatPhilippineTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-PH', {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
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
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeTab === 'dashboard' ? 'bg-lgu-green-700' : 'hover:bg-lgu-green-700'
                }`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => setActiveTab('emergencies')}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeTab === 'emergencies' ? 'bg-lgu-green-700' : 'hover:bg-lgu-green-700'
                }`}
              >
                🚨 Emergencies
              </button>
              <button
                onClick={() => setActiveTab('responders')}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeTab === 'responders' ? 'bg-lgu-green-700' : 'hover:bg-lgu-green-700'
                }`}
              >
                👨‍🚒 Responders
              </button>
              <button
                onClick={() => setActiveTab('announcements')}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeTab === 'announcements' ? 'bg-lgu-green-700' : 'hover:bg-lgu-green-700'
                }`}
              >
                📢 Announcements
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  activeTab === 'history' ? 'bg-lgu-green-700' : 'hover:bg-lgu-green-700'
                }`}
              >
                📖 History
              </button>
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
        <main className="flex-grow p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mb-8">
              Welcome back, {user?.name}!
            </p>

            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <>
                {/* Stats Cards - Clickable */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <button 
                    onClick={() => setActiveTab('emergencies')} 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-left cursor-pointer"
                  >
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="text-gray-600 text-sm font-medium">Total Emergencies</h3>
                    <p className="text-3xl font-bold text-lgu-green-600">{stats.total || 0}</p>
                  </button>

                  <button 
                    onClick={() => setActiveTab('emergencies')} 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-left cursor-pointer"
                  >
                    <div className="text-3xl mb-2">⏳</div>
                    <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending || 0}</p>
                  </button>

                  <button 
                    onClick={() => setActiveTab('emergencies')} 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-left cursor-pointer"
                  >
                    <div className="text-3xl mb-2">🚨</div>
                    <h3 className="text-gray-600 text-sm font-medium">Active</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.active || 0}</p>
                  </button>

                  <button 
                    onClick={() => setActiveTab('history')} 
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 text-left cursor-pointer"
                  >
                    <div className="text-3xl mb-2">✅</div>
                    <h3 className="text-gray-600 text-sm font-medium">Resolved</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.resolved || 0}</p>
                  </button>
                </div>

                {/* Recent Emergencies */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recent Emergencies</h2>
                    <input
                      type="text"
                      placeholder="🔍 Search emergencies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500 w-64"
                    />
                  </div>
                  {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading...</p>
                  ) : emergencies.length === 0 ? (
                    <p className="text-center py-12 text-gray-500">No emergencies yet</p>
                  ) : (
                    <div className="space-y-4">
                      {emergencies
                        .filter(e => 
                          e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.reportedBy?.name.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .sort((a, b) => {
                          // Sort by most recent activity (latest update or creation time)
                          const getLatestActivity = (emergency) => {
                            if (emergency.updates && emergency.updates.length > 0) {
                              const latestUpdate = emergency.updates[emergency.updates.length - 1]
                              return new Date(latestUpdate.timestamp)
                            }
                            return new Date(emergency.createdAt)
                          }
                          return getLatestActivity(b) - getLatestActivity(a)
                        })
                        .slice(0, 5)
                        .map((emergency) => (
                        <div key={emergency._id} className="border rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{emergency.type.toUpperCase()}</h3>
                              <p className="text-gray-600 text-sm">By: {emergency.reportedBy?.name}</p>
                            </div>
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(emergency.status)}`}>
                                {emergency.status}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(emergency.priority)}`}>
                                {emergency.priority}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{emergency.description}</p>
                          <p className="text-sm text-gray-500">📍 {emergency.location.address}</p>
                          <p className="text-sm text-gray-500">⏰ Created: {formatPhilippineTime(emergency.createdAt)}</p>
                          {emergency.updates && emergency.updates.length > 0 && (
                            <p className="text-sm text-blue-600">🔄 Last Update: {formatPhilippineTime(emergency.updates[emergency.updates.length - 1].timestamp)}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Emergencies Tab */}
            {activeTab === 'emergencies' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Emergency Management</h2>
                
                {/* Search and Filter Controls */}
                <div className="mb-6 space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <input
                      type="text"
                      placeholder="🔍 Search by type, description, or reporter..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 min-w-[250px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                    />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="responding">Responding</option>
                    </select>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                    >
                      <option value="all">All Types</option>
                      <option value="fire">Fire</option>
                      <option value="flood">Flood</option>
                      <option value="medical">Medical</option>
                      <option value="accident">Accident</option>
                      <option value="crime">Crime</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  {/* Date Range Picker */}
                  <div className="flex flex-wrap gap-4 items-center">
                    <label className="text-sm font-medium text-gray-700">📅 Date Range:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                      placeholder="Start Date"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                      placeholder="End Date"
                    />
                    {(startDate || endDate) && (
                      <button
                        onClick={() => {
                          setStartDate('')
                          setEndDate('')
                        }}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                      >
                        Clear Dates
                      </button>
                    )}
                  </div>
                </div>
                
                {loading ? (
                  <p className="text-center py-8 text-gray-500">Loading...</p>
                ) : emergencies
                    .filter(e => e.status !== 'resolved')
                    .filter(e => {
                      // Apply all filters
                      const matchesStatus = filterStatus === 'all' || e.status === filterStatus
                      const matchesType = filterType === 'all' || e.type === filterType
                      const matchesSearch = searchQuery === '' || 
                        e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        e.reportedBy?.name.toLowerCase().includes(searchQuery.toLowerCase())
                      
                      // Date range filter
                      const emergencyDate = new Date(e.createdAt)
                      const matchesStartDate = !startDate || emergencyDate >= new Date(startDate)
                      const matchesEndDate = !endDate || emergencyDate <= new Date(endDate + 'T23:59:59')
                      
                      return matchesStatus && matchesType && matchesSearch && matchesStartDate && matchesEndDate
                    })
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .length === 0 ? (
                  <p className="text-center py-12 text-gray-500">No matching emergencies found</p>
                ) : (
                  <div className="space-y-6">
                    {emergencies
                      .filter(e => e.status !== 'resolved')
                      .filter(e => {
                        // Apply all filters
                        const matchesStatus = filterStatus === 'all' || e.status === filterStatus
                        const matchesType = filterType === 'all' || e.type === filterType
                        const matchesSearch = searchQuery === '' || 
                          e.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.reportedBy?.name.toLowerCase().includes(searchQuery.toLowerCase())
                        
                        // Date range filter
                        const emergencyDate = new Date(e.createdAt)
                        const matchesStartDate = !startDate || emergencyDate >= new Date(startDate)
                        const matchesEndDate = !endDate || emergencyDate <= new Date(endDate + 'T23:59:59')
                        
                        return matchesStatus && matchesType && matchesSearch && matchesStartDate && matchesEndDate
                      })
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((emergency) => (
                      <div key={emergency._id} className="border rounded-lg p-6 hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">{emergency.type.toUpperCase()}</h3>
                            <p className="text-gray-600">Reported by: {emergency.reportedBy?.name}</p>
                            <p className="text-gray-600">Contact: {emergency.contactNumber}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(emergency.status)}`}>
                              {emergency.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(emergency.priority)}`}>
                              {emergency.priority}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{emergency.description}</p>
                        <p className="text-sm text-gray-600 mb-2">📍 Location: {emergency.location.address}</p>
                        <p className="text-sm text-gray-600">⏰ Created: {formatPhilippineTime(emergency.createdAt)}</p>
                        {emergency.updates && emergency.updates.length > 0 && (
                          <p className="text-sm text-blue-600 mb-2">🔄 Last Status Change: {formatPhilippineTime(emergency.updates[emergency.updates.length - 1].timestamp)} - <span className="font-semibold">{emergency.updates[emergency.updates.length - 1].status}</span></p>
                        )}
                        <div className="mb-4"></div>

                        {emergency.assignedResponders?.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="font-semibold text-blue-900 mb-1">Assigned Responders:</p>
                            <p className="text-blue-700">
                              {emergency.assignedResponders.map(r => r.name).join(', ')}
                            </p>
                          </div>
                        )}

                        {emergency.updates && emergency.updates.length > 0 && (
                          <div className="mb-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <p className="font-semibold text-green-900 mb-2">Updates & Notes:</p>
                            {emergency.updates.map((update, index) => (
                              <div key={index} className="mb-3 pb-3 border-b border-green-200 last:border-0 last:pb-0 last:mb-0">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-sm font-semibold text-green-900">
                                    {update.updatedBy?.name || 'Responder'} ({update.updatedBy?.role || 'responder'})
                                  </p>
                                  <p className="text-xs text-green-600">
                                    {formatPhilippineTime(update.timestamp)}
                                  </p>
                                </div>
                                <p className="text-sm text-green-700 mb-1">Status: {update.status}</p>
                                {update.notes && (
                                  <p className="text-sm text-green-800 italic">📝 {update.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {emergency.status === 'pending' && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-3">Dispatch Responders</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                              {responders.filter(r => r.isActive).map((responder) => {
                                const availability = responder.responderDetails?.availability || 'offline'
                                const availabilityColors = {
                                  available: 'bg-green-100 border-green-300',
                                  busy: 'bg-yellow-100 border-yellow-300',
                                  offline: 'bg-gray-100 border-gray-300'
                                }
                                const availabilityDots = {
                                  available: '🟢',
                                  busy: '🟡',
                                  offline: '⚪'
                                }
                                return (
                                  <label key={responder._id} className={`flex items-center space-x-2 p-2 border-2 rounded hover:shadow-md cursor-pointer ${availabilityColors[availability]}`}>
                                    <input
                                      type="checkbox"
                                      checked={selectedResponders.includes(responder._id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedResponders([...selectedResponders, responder._id])
                                        } else {
                                          setSelectedResponders(selectedResponders.filter(id => id !== responder._id))
                                        }
                                      }}
                                      className="form-checkbox"
                                    />
                                    <div className="flex-1">
                                      <span className="text-sm font-medium block">{responder.name}</span>
                                      <span className="text-xs text-gray-600">{availabilityDots[availability]} {availability}</span>
                                    </div>
                                  </label>
                                )
                              })}
                            </div>
                            <button
                              onClick={() => handleDispatchResponders(emergency._id)}
                              className="bg-lgu-green-600 text-white px-4 py-2 rounded-lg hover:bg-lgu-green-700 transition"
                            >
                              Dispatch Selected Responders
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Responders Tab */}
            {activeTab === 'responders' && (
              <div>
                {/* Add Responder Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Responder</h2>
                  <form onSubmit={handleCreateResponder} className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <input
                        type="text"
                        value={newResponder.name}
                        onChange={(e) => setNewResponder({ ...newResponder, name: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={newResponder.email}
                        onChange={(e) => setNewResponder({ ...newResponder, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        value={newResponder.phoneNumber}
                        onChange={(e) => setNewResponder({ ...newResponder, phoneNumber: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <input
                        type="password"
                        value={newResponder.password}
                        onChange={(e) => setNewResponder({ ...newResponder, password: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                      <select
                        value={newResponder.specialization}
                        onChange={(e) => setNewResponder({ ...newResponder, specialization: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                      >
                        <option value="general">General</option>
                        <option value="medical">Medical</option>
                        <option value="fire">Fire</option>
                        <option value="police">Police</option>
                        <option value="rescue">Rescue</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        type="submit"
                        className="w-full bg-lgu-green-600 text-white py-2 px-4 rounded-lg hover:bg-lgu-green-700 transition font-semibold"
                      >
                        Add Responder
                      </button>
                    </div>
                  </form>
                </div>

                {/* Responders List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Responders List</h2>
                  {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading...</p>
                  ) : responders.length === 0 ? (
                    <p className="text-center py-12 text-gray-500">No responders yet</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {responders.map((responder) => (
                            <tr key={responder._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{responder.name}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <div>{responder.email}</div>
                                <div>{responder.phoneNumber}</div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {responder.responderDetails?.specialization || 'General'}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  responder.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {responder.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleToggleResponder(responder._id, responder.isActive)}
                                  className={`px-3 py-1 rounded text-xs font-semibold ${
                                    responder.isActive 
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                                  }`}
                                >
                                  {responder.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Announcements Tab */}
            {activeTab === 'announcements' && (
              <div>
                {/* Create Announcement Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Announcement</h2>
                  <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                      <input
                        type="text"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                      <textarea
                        value={newAnnouncement.message}
                        onChange={(e) => setNewAnnouncement({ ...newAnnouncement, message: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        rows="4"
                        required
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select
                          value={newAnnouncement.type}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, type: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        >
                          <option value="general">General</option>
                          <option value="emergency">Emergency</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="event">Event</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                        <select
                          value={newAnnouncement.priority}
                          onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-lgu-green-600 text-white py-3 px-4 rounded-lg hover:bg-lgu-green-700 transition font-semibold"
                    >
                      Create Announcement
                    </button>
                  </form>
                </div>

                {/* Announcements List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">All Announcements</h2>
                  {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading...</p>
                  ) : announcements.length === 0 ? (
                    <p className="text-center py-12 text-gray-500">No announcements yet</p>
                  ) : (
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div key={announcement._id} className="border rounded-lg p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg">{announcement.title}</h3>
                            <div className="flex gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                announcement.type === 'emergency' ? 'bg-red-100 text-red-800' :
                                announcement.type === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {announcement.type}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(announcement.priority)}`}>
                                {announcement.priority}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{announcement.message}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              Created: {formatPhilippineTime(announcement.createdAt)}
                            </p>
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement._id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-semibold"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <>
                {/* Analytics Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Emergency Analytics</h2>
                  
                  {emergencies.filter(e => e.status === 'resolved').length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No resolved emergencies to analyze yet
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Emergency Type Distribution */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Emergency Types Distribution</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={getAnalyticsData().typeChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ type, count }) => `${type}: ${count}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {getAnalyticsData().typeChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                          
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={getAnalyticsData().typeChartData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="type" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="count" fill="#10b981" name="Cases" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Monthly Trend */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resolved Emergencies (Last 6 Months)</h3>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={getAnalyticsData().monthlyChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="Resolved Cases" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Top Responders */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">👨‍🚒 Top Responders</h3>
                        {getAnalyticsData().topResponders.length === 0 ? (
                          <p className="text-gray-500 text-center py-4">No responder data available</p>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-6">
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={getAnalyticsData().topResponders} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="resolved" fill="#8b5cf6" name="Cases Resolved" />
                              </BarChart>
                            </ResponsiveContainer>
                            
                            <div className="space-y-3">
                              {getAnalyticsData().topResponders.map((responder, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                                    }`}>
                                      {index + 1}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">{responder.name}</p>
                                      <p className="text-xs text-gray-600">{responder.specialization}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-purple-600">{responder.resolved}</p>
                                    <p className="text-xs text-gray-500">resolved</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* History List with Filters */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Emergency History</h2>
                  
                  {/* Filter Controls */}
                  <div className="mb-6 space-y-4">
                    <div className="flex flex-wrap gap-4">
                      <select
                        value={historyFilterType}
                        onChange={(e) => setHistoryFilterType(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                      >
                        <option value="all">All Types</option>
                        <option value="fire">Fire</option>
                        <option value="flood">Flood</option>
                        <option value="medical">Medical</option>
                        <option value="accident">Accident</option>
                        <option value="crime">Crime</option>
                        <option value="other">Other</option>
                      </select>
                      
                      <select
                        value={historySortBy}
                        onChange={(e) => setHistorySortBy(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                      >
                        <option value="resolvedDate">Sort by Resolved Date (Newest)</option>
                        <option value="resolvedDateOld">Sort by Resolved Date (Oldest)</option>
                        <option value="createdDate">Sort by Created Date (Newest)</option>
                        <option value="createdDateOld">Sort by Created Date (Oldest)</option>
                        <option value="type">Sort by Type</option>
                      </select>
                    </div>
                    
                    {/* Date Range Picker */}
                    <div className="flex flex-wrap gap-4 items-center">
                      <label className="text-sm font-medium text-gray-700">📅 Date Range:</label>
                      <input
                        type="date"
                        value={historyStartDate}
                        onChange={(e) => setHistoryStartDate(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        placeholder="Start Date"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="date"
                        value={historyEndDate}
                        onChange={(e) => setHistoryEndDate(e.target.value)}
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-lgu-green-500"
                        placeholder="End Date"
                      />
                      {(historyStartDate || historyEndDate) && (
                        <button
                          onClick={() => {
                            setHistoryStartDate('')
                            setHistoryEndDate('')
                          }}
                          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium"
                        >
                          Clear Dates
                        </button>
                      )}
                    </div>
                  </div>

                  {loading ? (
                    <p className="text-center py-8 text-gray-500">Loading...</p>
                  ) : emergencies.filter(e => e.status === 'resolved').length === 0 ? (
                    <p className="text-center py-12 text-gray-500">No resolved emergencies</p>
                  ) : (
                  <div className="space-y-6">
                    {emergencies
                      .filter(e => e.status === 'resolved')
                      .filter(e => {
                        // Type filter
                        const matchesType = historyFilterType === 'all' || e.type === historyFilterType
                        
                        // Date range filter
                        const resolvedDate = new Date(e.resolvedAt || e.createdAt)
                        const matchesStartDate = !historyStartDate || resolvedDate >= new Date(historyStartDate)
                        const matchesEndDate = !historyEndDate || resolvedDate <= new Date(historyEndDate + 'T23:59:59')
                        
                        return matchesType && matchesStartDate && matchesEndDate
                      })
                      .sort((a, b) => {
                        switch(historySortBy) {
                          case 'resolvedDate':
                            return new Date(b.resolvedAt || b.createdAt) - new Date(a.resolvedAt || a.createdAt)
                          case 'resolvedDateOld':
                            return new Date(a.resolvedAt || a.createdAt) - new Date(b.resolvedAt || b.createdAt)
                          case 'createdDate':
                            return new Date(b.createdAt) - new Date(a.createdAt)
                          case 'createdDateOld':
                            return new Date(a.createdAt) - new Date(b.createdAt)
                          case 'type':
                            return a.type.localeCompare(b.type)
                          default:
                            return new Date(b.resolvedAt || b.createdAt) - new Date(a.resolvedAt || a.createdAt)
                        }
                      })
                      .map((emergency) => (
                      <div key={emergency._id} className="border rounded-lg p-6 bg-gray-50">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-xl text-gray-900">{emergency.type.toUpperCase()}</h3>
                            <p className="text-gray-600">Reported by: {emergency.reportedBy?.name}</p>
                            <p className="text-gray-600">Contact: {emergency.contactNumber}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(emergency.status)}`}>
                              {emergency.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(emergency.priority)}`}>
                              {emergency.priority}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3">{emergency.description}</p>
                        <p className="text-sm text-gray-600 mb-2">📍 Location: {emergency.location.address}</p>
                        <p className="text-sm text-gray-600 mb-2">⏰ Reported: {formatPhilippineTime(emergency.createdAt)}</p>
                        {emergency.resolvedAt && (
                          <p className="text-sm text-green-600 mb-4">✅ Resolved: {formatPhilippineTime(emergency.resolvedAt)}</p>
                        )}

                        {emergency.assignedResponders?.length > 0 && (
                          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                            <p className="font-semibold text-blue-900 mb-1">Assigned Responders:</p>
                            <p className="text-blue-700">
                              {emergency.assignedResponders.map(r => r.name).join(', ')}
                            </p>
                          </div>
                        )}

                        {emergency.updates && emergency.updates.length > 0 && (
                          <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                            <p className="font-semibold text-green-900 mb-2">Updates & Notes:</p>
                            {emergency.updates.map((update, index) => (
                              <div key={index} className="mb-3 pb-3 border-b border-green-200 last:border-0 last:pb-0 last:mb-0">
                                <div className="flex justify-between items-start mb-1">
                                  <p className="text-sm font-semibold text-green-900">
                                    {update.updatedBy?.name || 'Responder'} ({update.updatedBy?.role || 'responder'})
                                  </p>
                                  <p className="text-xs text-green-600">
                                    {formatPhilippineTime(update.timestamp)}
                                  </p>
                                </div>
                                <p className="text-sm text-green-700 mb-1">Status: {update.status}</p>
                                {update.notes && (
                                  <p className="text-sm text-green-800 italic">📝 {update.notes}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default AdminDashboard

# DREAM - Disaster Response and Emergency Action Management

<div align="center">
  <h3>🆘 Emergency Response System for San Isidro Labrador I</h3>
  <p>A comprehensive disaster response platform connecting residents, responders, and administrators during emergencies</p>
</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

**DREAM (Disaster Response and Emergency Action Management)** is a full-stack hybrid system designed for barangay-level emergency response management. The system provides a unified platform for:

- **Residents** to report emergencies and receive alerts
- **Responders** to respond to assigned emergencies  
- **Administrators** to manage operations, dispatch responders, and broadcast announcements

The project consists of three main applications:
1. **Backend API Server** (Node.js/Express)
2. **Web Dashboard** (React + Vite)
3. **Mobile Application** (React Native + Expo)

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DREAM SYSTEM                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Mobile     │    │   Web        │    │   Backend    │ │
│  │   (Expo)     │───▶│   (React)    │───▶│   (Express)  │ │
│  │              │    │              │    │              │ │
│  │ - Residents  │    │ - Admin      │    │ - REST API   │ │
│  │ - Responders │    │ - Responders │    │ - Auth       │ │
│  └──────────────┘    └──────────────┘    │ - MongoDB    │ │
│                                           └──────────────┘ │
│                                                 │           │
│                                                 ▼           │
│                                          ┌──────────────┐  │
│                                          │   MongoDB    │  │
│                                          │   Database   │  │
│                                          └──────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔴 For Residents
- ✅ User registration and authentication
- ✅ Report emergencies with location and details
- ✅ Track submitted emergency reports
- ✅ View real-time announcements and alerts
- ✅ View emergency status updates
- ✅ Contact information management

### 🟢 For Responders
- ✅ Dedicated responder accounts with specializations
- ✅ View assigned emergencies
- ✅ Update emergency status and progress
- ✅ Real-time notifications
- ✅ Availability management (available/busy/offline)

### 🔵 For Administrators
- ✅ Comprehensive dashboard with statistics
- ✅ Emergency management and dispatch system
- ✅ Responder management (create, update, assign)
- ✅ Announcement broadcasting system
- ✅ Real-time emergency tracking
- ✅ Priority-based emergency handling
- ✅ Historical data and reporting

### 🎨 General Features
- 🔐 JWT-based authentication
- 📱 Responsive design (mobile and web)
- 🔄 Real-time updates
- 📊 Statistics and analytics
- 🗺️ Location tracking
- 🔔 Alert system with priority levels
- 📝 Audit trail for emergency updates

---

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js v4.18
- **Database:** MongoDB with Mongoose ODM v8.0
- **Authentication:** JWT (JSON Web Tokens) v9.0
- **Security:** bcrypt v5.1 for password hashing
- **Environment:** dotenv v16.3
- **CORS:** cors v2.8

### Web Application
- **Framework:** React v18.2
- **Build Tool:** Vite v5.0
- **Routing:** React Router DOM v6.20
- **Styling:** Tailwind CSS v3.3
- **HTTP Client:** Axios v1.6
- **State Management:** React Context API

### Mobile Application
- **Framework:** React Native v0.81
- **Platform:** Expo SDK v54.0
- **UI Components:** NativeBase v3.4
- **Navigation:** React Navigation v6.1
- **Storage:** AsyncStorage v2.2
- **HTTP Client:** Axios v1.6

---

## 📁 Project Structure

```
RespondaPH/
├── server/                    # Backend API Server
│   ├── src/
│   │   ├── index.js          # Express app entry point
│   │   ├── middleware/
│   │   │   └── auth.js       # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js       # User model (residents, responders, admin)
│   │   │   ├── Emergency.js  # Emergency report model
│   │   │   └── Announcement.js # Announcement model
│   │   └── routes/
│   │       ├── auth.js       # Authentication routes
│   │       ├── users.js      # User profile routes
│   │       ├── emergencies.js # Emergency management routes
│   │       ├── announcements.js # Announcement routes
│   │       └── responders.js # Responder management routes
│   ├── scripts/
│   │   └── create-admin.js   # Admin account creation script
│   ├── .env.example          # Environment variables template
│   └── package.json
│
├── web/                       # Web Dashboard (React + Vite)
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   ├── Footer.jsx    # Footer component
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication context
│   │   └── pages/
│   │       ├── LandingPage.jsx # Homepage
│   │       ├── Login.jsx     # Login page
│   │       ├── Register.jsx  # Registration page
│   │       ├── AdminDashboard.jsx # Admin control panel
│   │       └── ResidentDashboard.jsx # Resident dashboard
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── mobile/                    # Mobile App (React Native + Expo)
    ├── src/
    │   ├── App.js            # Main app component
    │   ├── config/
    │   │   └── api.js        # API configuration
    │   ├── context/
    │   │   └── AuthContext.js # Authentication context
    │   ├── components/
    │   │   ├── EmergencyDetailModal.js
    │   │   └── AnnouncementDetailModal.js
    │   └── screens/
    │       ├── WelcomeScreen.js # Landing screen
    │       ├── LoginScreen.js # Login screen
    │       ├── RegisterScreen.js # Registration screen
    │       ├── ResidentDashboardScreen.js # Resident main screen
    │       └── ResponderDashboardScreen.js # Responder main screen
    ├── App.js                # Expo entry point
    ├── app.json              # Expo configuration
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18.x or higher
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager
- Expo CLI (for mobile development)
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/LeeDev428/RespondaPH.git
cd RespondaPH
```

### 2️⃣ Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env file with your credentials
# Required variables:
# - MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tugon
# - JWT_SECRET=your_secure_random_string
# - PORT=5000
```

**Create Admin Account:**
```bash
npm run create-admin
```
Default admin credentials:
- Email: `admin@dream.com`
- Password: `admin123`

**Start the server:**
```bash
npm run dev   # Development mode with nodemon
# OR
npm start     # Production mode
```

Server will run on `http://localhost:5000`

### 3️⃣ Web Dashboard Setup

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Web dashboard will run on `http://localhost:5173` (or next available port)

### 4️⃣ Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Update API configuration
# Edit src/config/api.js and replace with your IP address:
# export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000';

# Start Expo development server
npm start

# Or run directly on platform:
npm run android  # Android emulator/device
npm run ios      # iOS simulator (Mac only)
npm run web      # Web browser
```

**Important:** For testing on physical devices, update the `API_BASE_URL` in `mobile/src/config/api.js` with your computer's local IP address.

---

## 📖 Usage Guide

### For Residents (Mobile/Web)

1. **Registration:**
   - Open the mobile app or visit the web dashboard
   - Click "Create Account"
   - Fill in: Name, Email, Phone Number, Password
   - Submit to create a resident account

2. **Report Emergency:**
   - Login with your credentials
   - Navigate to "Request Help" or "Report Emergency"
   - Select emergency type (fire, flood, medical, accident, crime, other)
   - Enter description and location details
   - Submit the report

3. **Track Reports:**
   - View "My Reports" section
   - Check status: pending, dispatched, responding, resolved
   - View assigned responders and updates

4. **View Announcements:**
   - Check the "Alerts" or "Announcements" section
   - View important notifications from administrators

### For Administrators (Web Dashboard)

1. **Login:**
   - Visit `http://localhost:5173`
   - Use admin credentials
   - Navigate to Admin Dashboard

2. **Manage Emergencies:**
   - View all emergency reports
   - Filter by status, type, or priority
   - Dispatch responders to emergencies
   - Update emergency status and add notes
   - View statistics and analytics

3. **Manage Responders:**
   - Create new responder accounts
   - Assign specializations (fire, medical, police, rescue, general)
   - Update responder availability
   - Deactivate/activate accounts

4. **Create Announcements:**
   - Compose announcements with title and message
   - Set type (general, warning, alert, info)
   - Set priority (low, medium, high)
   - Publish to all users

### For Responders (Mobile)

1. **Login:**
   - Use responder credentials provided by admin
   - Access responder dashboard

2. **View Assigned Emergencies:**
   - See emergencies assigned to you
   - View emergency details and location
   - Check priority levels

3. **Update Status:**
   - Update emergency status as you respond
   - Add notes and updates
   - Mark emergencies as resolved

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication Routes (`/api/auth`)

**POST /api/auth/register**
- **Description:** Register new resident account
- **Access:** Public
- **Body:**
```json
{
  "name": "Juan Dela Cruz",
  "email": "juan@example.com",
  "phoneNumber": "09123456789",
  "password": "securePassword123"
}
```
- **Response:** User object and JWT token

**POST /api/auth/login**
- **Description:** Login user (email or phone number)
- **Access:** Public
- **Body:**
```json
{
  "emailOrPhone": "juan@example.com",
  "password": "securePassword123"
}
```
- **Response:** User object and JWT token

#### Emergency Routes (`/api/emergencies`)

**POST /api/emergencies**
- **Description:** Create new emergency report
- **Access:** Private (Resident)
- **Body:**
```json
{
  "type": "fire",
  "description": "House fire on Main St",
  "location": {
    "address": "123 Main St, Barangay XYZ",
    "coordinates": {
      "latitude": 14.5995,
      "longitude": 120.9842
    }
  },
  "contactNumber": "09123456789",
  "priority": "high"
}
```

**GET /api/emergencies**
- **Description:** Get emergencies (filtered by user role)
- **Access:** Private
- **Query Params:** `status`, `type`

**GET /api/emergencies/:id**
- **Description:** Get emergency by ID
- **Access:** Private

**PUT /api/emergencies/:id**
- **Description:** Update emergency (dispatch/status)
- **Access:** Private (Admin/Responder)
- **Body:**
```json
{
  "status": "dispatched",
  "assignedResponders": ["responderId1", "responderId2"],
  "priority": "critical",
  "notes": "Unit dispatched"
}
```

**GET /api/emergencies/stats/dashboard**
- **Description:** Get emergency statistics
- **Access:** Private (Admin)

#### Announcement Routes (`/api/announcements`)

**POST /api/announcements**
- **Description:** Create announcement
- **Access:** Private (Admin)
- **Body:**
```json
{
  "title": "Flood Warning",
  "message": "Heavy rainfall expected. Stay alert.",
  "type": "warning",
  "priority": "high"
}
```

**GET /api/announcements**
- **Description:** Get all active announcements
- **Access:** Private

**GET /api/announcements/:id**
- **Description:** Get announcement by ID
- **Access:** Private

**PUT /api/announcements/:id**
- **Description:** Update announcement
- **Access:** Private (Admin)

**DELETE /api/announcements/:id**
- **Description:** Delete announcement
- **Access:** Private (Admin)

#### Responder Routes (`/api/responders`)

**POST /api/responders**
- **Description:** Create responder account
- **Access:** Private (Admin)
- **Body:**
```json
{
  "name": "Officer Juan Santos",
  "email": "juan.santos@responder.com",
  "phoneNumber": "09187654321",
  "password": "responderPass123",
  "specialization": "medical"
}
```

**GET /api/responders**
- **Description:** Get all responders
- **Access:** Private (Admin)

**PUT /api/responders/:id**
- **Description:** Update responder details
- **Access:** Private (Admin)

**DELETE /api/responders/:id**
- **Description:** Delete responder account
- **Access:** Private (Admin)

**PUT /api/responders/:id/availability**
- **Description:** Update responder availability
- **Access:** Private (Responder/Admin)

#### User Routes (`/api/users`)

**GET /api/users/profile**
- **Description:** Get current user profile
- **Access:** Private

---

## 👥 User Roles

### 1. Administrator (Admin)
- **Creation:** Via `create-admin.js` script
- **Capabilities:**
  - Full system access
  - Create and manage responders
  - Dispatch responders to emergencies
  - Create and manage announcements
  - View all emergencies
  - Access statistics and analytics
  - Update emergency priorities and status

### 2. Responder
- **Creation:** Admin creates responder accounts
- **Specializations:** Fire, Medical, Police, Rescue, General
- **Capabilities:**
  - View assigned emergencies
  - Update emergency status
  - Add response notes
  - Update availability status
  - View announcements

### 3. Resident
- **Creation:** Self-registration (public)
- **Capabilities:**
  - Report emergencies
  - View own emergency reports
  - Track emergency status
  - View announcements
  - Update profile

---

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  phoneNumber: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'resident', 'responder']),
  isActive: Boolean (default: true),
  responderDetails: {
    specialization: String (enum: ['fire', 'medical', 'police', 'rescue', 'general']),
    availability: String (enum: ['available', 'busy', 'offline'])
  },
  createdAt: Date
}
```

### Emergency Model
```javascript
{
  reportedBy: ObjectId (ref: User),
  type: String (enum: ['fire', 'flood', 'medical', 'accident', 'crime', 'other']),
  description: String (required),
  location: {
    address: String (required),
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contactNumber: String (required),
  status: String (enum: ['pending', 'dispatched', 'responding', 'resolved', 'cancelled']),
  priority: String (enum: ['low', 'medium', 'high', 'critical']),
  assignedResponders: [ObjectId] (ref: User),
  updates: [{
    updatedBy: ObjectId (ref: User),
    status: String,
    notes: String,
    timestamp: Date
  }],
  resolvedAt: Date,
  createdAt: Date
}
```

### Announcement Model
```javascript
{
  title: String (required),
  message: String (required),
  type: String (enum: ['general', 'warning', 'alert', 'info']),
  priority: String (enum: ['low', 'medium', 'high']),
  createdBy: ObjectId (ref: User),
  isActive: Boolean (default: true),
  createdAt: Date
}
```

---

## 🎨 Screenshots

### Web Dashboard
- Landing page with features showcase
- Login/Registration forms
- Admin dashboard with statistics
- Emergency management interface
- Responder management panel
- Announcement creation form

### Mobile App
- Welcome screen
- Login/Registration screens
- Resident dashboard with action cards
- Emergency reporting form
- Emergency tracking screen
- Announcement viewer
- Responder dashboard

---

## 💻 Development

### Available Scripts

**Backend (Server):**
```bash
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm run create-admin # Create admin account
```

**Web Dashboard:**
```bash
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

**Mobile App:**
```bash
npm start            # Start Expo dev server
npm run android      # Run on Android
npm run ios          # Run on iOS
npm run web          # Run on web browser
```

### Development Tips

1. **Backend Development:**
   - Use nodemon for auto-reload
   - Check MongoDB connection in console
   - Test API endpoints with Postman or similar tools
   - View logs for authentication issues

2. **Frontend Development:**
   - Hot reload enabled by default
   - Check browser console for errors
   - Use React DevTools for debugging
   - Test responsive design on different screen sizes

3. **Mobile Development:**
   - Use Expo Go app for testing on physical devices
   - Update API_BASE_URL with your local IP
   - Test on both Android and iOS if possible
   - Use React Native Debugger for advanced debugging

### Code Style
- ES6+ JavaScript/JSX
- Async/await for asynchronous operations
- Functional components with hooks (React)
- RESTful API design principles
- Meaningful variable and function names
- Comments for complex logic

---

## 🌐 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. **Prepare for deployment:**
   - Ensure `package.json` has correct start script
   - Set environment variables on platform
   - Update CORS origins for production URLs

2. **Environment Variables:**
   ```
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   PORT=5000
   NODE_ENV=production
   ```

3. **Deploy:**
   ```bash
   git push heroku master
   # OR follow platform-specific instructions
   ```

### Web Dashboard Deployment (Vercel/Netlify)

1. **Update API URLs:**
   - Replace localhost URLs with production backend URL
   - Update in axios calls and API configuration

2. **Build and deploy:**
   ```bash
   npm run build
   # Follow Vercel/Netlify deployment instructions
   ```

### Mobile App Deployment

1. **Build for Android:**
   ```bash
   eas build --platform android
   ```

2. **Build for iOS:**
   ```bash
   eas build --platform ios
   ```

3. **Submit to stores:**
   - Follow Expo EAS Submit documentation
   - Prepare app store listings and assets

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Areas
- Bug fixes
- New features
- Documentation improvements
- UI/UX enhancements
- Performance optimizations
- Test coverage

---

## 📝 License

This project is developed for barangay-level disaster response management. All rights reserved.

---

## 👨‍💻 Developer Information

**Repository:** [LeeDev428/RespondaPH](https://github.com/LeeDev428/RespondaPH)  
**Branch:** master  
**Project Name:** RespondaPH / DREAM  
**Version:** 1.0.0

---

## 🆘 Support & Contact

For questions, issues, or suggestions:
- Create an issue on GitHub
- Contact the barangay IT department
- Email: support@dream.ph (if applicable)

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

## 🙏 Acknowledgments

- San Isidro Labrador I Barangay Officials
- Local Government Unit (LGU)
- First responders and emergency personnel
- Community residents

---

<div align="center">
  <p>Built with ❤️ for San Isidro Labrador I Community</p>
  <p>© 2024 DREAM - Disaster Response and Emergency Action Management</p>
</div>

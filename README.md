# 🚨 Tugon - Barangay Disaster Response System

A full-stack MERN + React Native hybrid application for disaster response and emergency management in Barangay San Isidro Labrador I.

## 📁 Project Structure

```
RespondaPH/
├── server/          # Node.js + Express + MongoDB Backend
├── web/             # React + Vite + TailwindCSS Web App
├── mobile/          # React Native + NativeBase Mobile App
└── README.md
```

## 🎯 Core Features

1. **Landing Page** - Introduction to the disaster response system
2. **Login & Registration** - User authentication (Admin/Resident roles)
3. **Admin Dashboard** - Management interface for barangay officials
4. **Resident Dashboard** - Emergency reporting and alerts for residents

## 🎨 Design

- **Color Palette**: Modern LGU-inspired green theme
- **Web**: TailwindCSS with responsive design
- **Mobile**: NativeBase components with consistent styling
- **Professional and minimalist UI**

---

## 🖥️ Backend Setup (Server)

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account (already configured)

### Installation

```powershell
cd server
npm install
```

### Environment Variables

The `.env` file is already configured with your MongoDB URI:

```env
MONGODB_URI=mongodb+srv://grafrafraftorres28:y33CwzAkoHffENbQ@cluster0.0c5qorv.mongodb.net/tugon?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=tugon_disaster_response_secret_key_2025
PORT=5000
```

### Run Server

```powershell
cd server
npm run dev
```

The server will run on **http://localhost:5000**

### API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/profile` - Get user profile (Protected)

---

## 🌐 Web App Setup

### Prerequisites
- Node.js 16+ installed

### Installation

```powershell
cd web
npm install
```

### Run Web App

```powershell
cd web
npm start
```

The web app will run on **http://localhost:3000**

### Web Pages

- `/` - Landing Page
- `/login` - Login Page
- `/register` - Registration Page
- `/admin/dashboard` - Admin Dashboard (requires admin role)
- `/resident/dashboard` - Resident Dashboard (requires resident role)

---

## 📱 Mobile App Setup

### Prerequisites
- Node.js 16+ installed
- Android Studio (for Android development)
- React Native CLI: `npm install -g react-native-cli`

### Installation

```powershell
cd mobile
npm install
```

### Android Setup

1. Make sure Android Studio is installed with an Android Virtual Device (AVD)
2. Start the AVD or connect a physical device
3. Run the app:

```powershell
cd mobile
npx react-native run-android
```

### iOS Setup (Mac only)

```bash
cd mobile
cd ios
pod install
cd ..
npx react-native run-ios
```

### Mobile Screens

- **Welcome Screen** - App introduction
- **Login Screen** - User authentication
- **Register Screen** - New user registration
- **Resident Dashboard** - Main dashboard with action cards

### Important Notes for Mobile

- The mobile app uses `http://10.0.2.2:5000` to connect to localhost (Android emulator)
- For physical devices, replace with your computer's IP address (e.g., `http://192.168.1.100:5000`)

---

## 🔐 User Roles

### Resident
- Report emergencies
- View personal reports
- Receive alerts
- Access emergency contacts

### Admin
- View all reports
- Manage residents
- Dashboard analytics
- Emergency management

---

## 🚀 Quick Start Guide

### 1. Start the Backend

```powershell
cd server
npm install
npm run dev
```

### 2. Start the Web App

```powershell
cd web
npm install
npm start
```

### 3. Start the Mobile App (Optional)

```powershell
cd mobile
npm install
npx react-native run-android
```

---

## 📝 Testing the Application

### Register a Test User

1. Go to http://localhost:3000/register
2. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: Resident or Admin
3. Click Register

### Login

1. Go to http://localhost:3000/login
2. Enter credentials
3. You'll be redirected to the appropriate dashboard

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (Atlas)
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Web Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **TailwindCSS** - Styling
- **Axios** - HTTP client

### Mobile App
- **React Native** - Mobile framework
- **NativeBase** - UI components
- **React Navigation** - Navigation
- **AsyncStorage** - Local storage
- **Axios** - HTTP client

---

## 🎨 Color Palette

### LGU Green Theme

```
emerald-50:  #f0fdf4  (Background)
emerald-100: #dcfce7
emerald-200: #bbf7d0
emerald-400: #4ade80
emerald-600: #16a34a  (Primary)
emerald-700: #15803d  (Primary Dark)
emerald-800: #166534
```

---

## 📂 Key Files

### Backend
- `server/src/index.js` - Express server entry
- `server/src/models/User.js` - User schema
- `server/src/routes/auth.js` - Auth endpoints
- `server/src/middleware/auth.js` - JWT middleware

### Web
- `web/src/App.jsx` - Main app component
- `web/src/pages/` - All page components
- `web/src/context/AuthContext.jsx` - Auth state management
- `web/tailwind.config.js` - Tailwind configuration

### Mobile
- `mobile/src/App.js` - Main app with navigation
- `mobile/src/screens/` - All screen components
- `mobile/src/context/AuthContext.js` - Auth state management

---

## 🐛 Troubleshooting

### Backend Issues
- **Can't connect to MongoDB**: Check your internet connection and MongoDB URI
- **Port 5000 in use**: Change PORT in `.env` file

### Web Issues
- **Port 3000 in use**: Vite will prompt for an alternative port
- **TailwindCSS not working**: Run `npm install` again

### Mobile Issues
- **Metro bundler error**: Run `npx react-native start --reset-cache`
- **Android build fails**: Clear cache: `cd android && ./gradlew clean`
- **Can't connect to server**: Update API URL to your computer's IP address

---

## 📞 Emergency Contacts

- **National Emergency**: 911
- **Barangay Office**: (123) 456-7890

---

## 👨‍💻 Development

### Adding New Features

1. **Backend**: Add routes in `server/src/routes/`
2. **Web**: Add pages in `web/src/pages/`
3. **Mobile**: Add screens in `mobile/src/screens/`

### Database Collections

- **users** - User accounts (name, email, password, role)

---

## 📄 License

MIT License - Feel free to use for your barangay!

---

## 🙏 Acknowledgments

Built for Barangay San Isidro Labrador I to enhance disaster response and community safety.

---

**Happy Coding! 🚀**

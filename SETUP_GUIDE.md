# 🚀 DREAM System - Complete Setup Guide

<div align="center">
  <h2>Step-by-Step Installation Instructions</h2>
  <p>Follow this guide to set up the DREAM system on your local machine</p>
</div>

---

## 📋 Table of Contents

1. [System Requirements](#system-requirements)
2. [Required Software Downloads](#required-software-downloads)
3. [Installation Steps](#installation-steps)
4. [Database Setup](#database-setup)
5. [Project Setup](#project-setup)
6. [Running the Applications](#running-the-applications)
7. [Testing the System](#testing-the-system)
8. [Troubleshooting](#troubleshooting)

---

## 💻 System Requirements

### Minimum Requirements:
- **Operating System:** Windows 10/11, macOS 10.15+, or Linux
- **RAM:** 8GB minimum (16GB recommended)
- **Storage:** 5GB free space
- **Internet Connection:** Required for initial setup

---

## 📥 Required Software Downloads

### 1️⃣ Node.js (v18.x or higher)

**What it does:** JavaScript runtime needed to run the backend and frontend applications

**Download Link:** https://nodejs.org/

**Installation:**
- Download the **LTS (Long Term Support)** version
- Run the installer
- ✅ Check "Automatically install necessary tools" during installation
- Verify installation:
  ```bash
  node --version
  npm --version
  ```
  Should show v18.x or higher

---

### 2️⃣ Git

**What it does:** Version control system to download the project code

**Download Link:** https://git-scm.com/downloads

**Installation:**
- Download for your operating system
- Run the installer with default settings
- Verify installation:
  ```bash
  git --version
  ```

---

### 3️⃣ MongoDB Account (Cloud Database)

**What it does:** Database to store all application data

**Setup Steps:**

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up with email or Google account
   - It's **FREE** for the tier we need

2. **Create a Cluster:**
   - After login, click **"Build a Database"**
   - Choose **"M0 FREE"** tier
   - Select a cloud provider (AWS recommended)
   - Choose region closest to you
   - Click **"Create"**

3. **Create Database User:**
   - Click **"Database Access"** in left sidebar
   - Click **"Add New Database User"**
   - Choose **"Password"** authentication
   - Username: `dreamadmin` (or any name you prefer)
   - Password: Create a strong password (SAVE THIS!)
   - User Privileges: **"Atlas admin"**
   - Click **"Add User"**

4. **Whitelist IP Address:**
   - Click **"Network Access"** in left sidebar
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (or add your specific IP)
   - Click **"Confirm"**

5. **Get Connection String:**
   - Click **"Database"** in left sidebar
   - Click **"Connect"** on your cluster
   - Click **"Connect your application"**
   - Copy the connection string (looks like):
     ```
     mongodb+srv://dreamadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **SAVE THIS STRING!** You'll need it later
   - Replace `<password>` with your actual database password

---

### 4️⃣ Code Editor (VS Code Recommended)

**What it does:** Edit code and view project files

**Download Link:** https://code.visualstudio.com/

**Installation:**
- Download for your operating system
- Install with default settings
- **Recommended Extensions:**
  - ESLint
  - Prettier - Code formatter
  - React Developer Tools
  - Thunder Client (for API testing)

---

### 5️⃣ Expo Go Mobile App (For Mobile Testing)

**What it does:** Test the mobile app on your phone

**Download:**
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent
- **iOS:** https://apps.apple.com/app/expo-go/id982107779

---

## 🔧 Installation Steps

### Step 1: Open Terminal/Command Prompt

**Windows:**
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

**Mac/Linux:**
- Press `Cmd + Space` (Mac) or `Ctrl + Alt + T` (Linux)
- Type `terminal`
- Press Enter

---

### Step 2: Navigate to Your Desired Folder

```bash
# Example: Create and navigate to Projects folder
cd Desktop
mkdir Projects
cd Projects
```

---

### Step 3: Clone the Project

```bash
git clone https://github.com/LeeDev428/RespondaPH.git
cd RespondaPH
```

✅ **You should now see the project folders:** `server`, `web`, `mobile`

---

## 🗄️ Database Setup

### Connect MongoDB to Your Project

1. **Open the server folder:**
   ```bash
   cd server
   ```

2. **Create environment file:**
   ```bash
   # Copy the example file
   copy .env.example .env
   ```
   (On Mac/Linux use: `cp .env.example .env`)

3. **Edit the .env file:**
   - Open `.env` file in VS Code or Notepad
   - Replace the values:
     ```env
     MONGODB_URI=mongodb+srv://dreamadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dream?retryWrites=true&w=majority
     JWT_SECRET=your_super_secret_random_string_here_12345
     PORT=5000
     ```
   
   **Important:**
   - Replace `YOUR_PASSWORD` with your MongoDB password
   - Replace the cluster URL with your actual MongoDB connection string
   - For `JWT_SECRET`, use any random long string (mix of letters, numbers, symbols)

4. **Save the file**

---

## 📦 Project Setup

### Part 1: Backend Server Setup

```bash
# Make sure you're in the server folder
cd server

# Install all required packages (this may take 5-10 minutes)
npm install

# Create admin account
npm run create-admin
```

✅ **Expected Output:**
```
✅ Connected to MongoDB
✅ Admin user created successfully!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email: admin@dream.com
🔑 Password: admin123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**SAVE THESE CREDENTIALS!** You'll use them to login.

---

### Part 2: Web Dashboard Setup

```bash
# Navigate to web folder
cd ../web

# Install packages
npm install
```

✅ Wait for installation to complete

---

### Part 3: Mobile App Setup

```bash
# Navigate to mobile folder
cd ../mobile

# Install packages
npm install
```

✅ Wait for installation to complete

**Important - Update API Configuration:**

1. **Find your computer's IP address:**
   
   **Windows:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" under your active network (usually starts with 192.168.x.x)
   
   **Mac/Linux:**
   ```bash
   ifconfig
   ```
   Look for "inet" under your active network

2. **Update the mobile app configuration:**
   - Open `mobile/src/config/api.js` in your code editor
   - Replace the IP address:
     ```javascript
     export const API_BASE_URL = 'http://YOUR_IP_ADDRESS:5000';
     ```
   - Example: `'http://192.168.1.100:5000'`
   - Save the file

---

## ▶️ Running the Applications

### Start Backend Server (Terminal 1)

```bash
# Navigate to server folder
cd server

# Start the server
npm run dev
```

✅ **Expected Output:**
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

**Keep this terminal running!** Don't close it.

---

### Start Web Dashboard (Terminal 2)

Open a **NEW** terminal window:

```bash
# Navigate to web folder
cd web

# Start the web app
npm run dev
```

✅ **Expected Output:**
```
  VITE v5.0.8  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**Keep this terminal running!**

**Open in browser:** http://localhost:5173

---

### Start Mobile App (Terminal 3)

Open **another NEW** terminal window:

```bash
# Navigate to mobile folder
cd mobile

# Start Expo
npm start
```

✅ **Expected Output:**
```
Metro waiting on exp://192.168.x.x:8081

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
```

**Testing Options:**

1. **On Your Phone (Recommended):**
   - Open **Expo Go** app on your phone
   - Scan the QR code shown in terminal
   - Make sure phone and computer are on the **same WiFi network**

2. **On Web Browser:**
   - Press `w` in the terminal
   - Browser will open automatically

3. **On Android Emulator:**
   - Press `a` in the terminal
   - Requires Android Studio installed

---

## 🧪 Testing the System

### 1. Test Web Dashboard

1. Open browser: http://localhost:5173
2. Click **"Login"**
3. Enter credentials:
   - Email: `admin@dream.com`
   - Password: `admin123`
4. Click **"Login"**

✅ **You should see the Admin Dashboard!**

---

### 2. Test Mobile App

1. Open app in Expo Go or browser
2. Click **"Get Started"** or **"Login"**
3. Click **"Don't have an account? Register"**
4. Create a test resident account:
   - Name: Test User
   - Email: test@example.com
   - Phone: 09123456789
   - Password: test123
5. Click **"Register"**

✅ **You should see the Resident Dashboard!**

---

### 3. Create Test Emergency

1. In mobile app (as resident):
   - Click **"Request Help"**
   - Select emergency type: "Medical"
   - Description: "Test emergency report"
   - Location: "123 Test Street"
   - Contact: 09123456789
   - Click **"Submit"**

2. In web dashboard (as admin):
   - Navigate to **"Emergencies"** tab
   - You should see the new emergency report!

✅ **System is working correctly!**

---

## 🛠️ Troubleshooting

### Problem: MongoDB Connection Error

**Error Message:** `MongoNetworkError: failed to connect to server`

**Solutions:**
1. Check your internet connection
2. Verify MongoDB connection string in `.env` file
3. Check if IP is whitelisted in MongoDB Atlas
4. Ensure password doesn't have special characters (use only letters/numbers)

---

### Problem: Port Already in Use

**Error Message:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**

**Windows:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9
```

Or change the PORT in `.env` file to 5001 or 5002

---

### Problem: npm install Fails

**Error Message:** `npm ERR! code EACCES` or permission errors

**Solutions:**
1. Run terminal as Administrator (Windows) or use `sudo` (Mac/Linux)
2. Clear npm cache:
   ```bash
   npm cache clean --force
   npm install
   ```

---

### Problem: Mobile App Not Loading

**Solutions:**
1. Ensure phone and computer are on the **same WiFi network**
2. Check if API_BASE_URL in `mobile/src/config/api.js` has correct IP
3. Disable firewall temporarily
4. Try pressing `r` in Expo terminal to reload
5. Close and reopen Expo Go app

---

### Problem: React Native Build Errors

**Solutions:**
```bash
# Clear cache and reinstall
cd mobile
rm -rf node_modules
npm cache clean --force
npm install

# Reset Expo
expo start -c
```

---

### Problem: "Cannot GET /" Error

**Solution:** Make sure backend server is running in terminal 1

---

### Problem: Blank Screen on Web

**Solutions:**
1. Check browser console for errors (F12)
2. Clear browser cache
3. Try incognito/private mode
4. Ensure backend is running

---

## 📞 Quick Command Reference

### Check if everything is running:

**Backend:** http://localhost:5000 (should show "DREAM API is running")
**Web:** http://localhost:5173 (should show landing page)
**Mobile:** Check Expo Go app or browser

### Stop applications:
Press `Ctrl + C` in each terminal

### Restart everything:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Web
cd web
npm run dev

# Terminal 3 - Mobile
cd mobile
npm start
```

---

## ✅ Setup Checklist

Use this to verify your setup:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] Git installed (`git --version`)
- [ ] MongoDB Atlas account created
- [ ] MongoDB connection string copied
- [ ] Project cloned from GitHub
- [ ] `.env` file created in `server/` folder
- [ ] MongoDB URI and JWT_SECRET added to `.env`
- [ ] `npm install` completed in `server/` folder
- [ ] Admin account created successfully
- [ ] `npm install` completed in `web/` folder
- [ ] `npm install` completed in `mobile/` folder
- [ ] IP address updated in `mobile/src/config/api.js`
- [ ] Backend server running (Terminal 1)
- [ ] Web dashboard running (Terminal 2)
- [ ] Mobile app running (Terminal 3)
- [ ] Admin login working on web
- [ ] Resident registration working on mobile
- [ ] Emergency report creation working

---

## 🎉 Success!

If you've completed all the steps and the checklist, your DREAM system is now fully operational!

### Next Steps:

1. **Change Admin Password:**
   - Login as admin
   - Go to profile settings
   - Update password from default `admin123`

2. **Create Responders:**
   - Login as admin
   - Go to "Responders" tab
   - Create responder accounts for your team

3. **Customize Settings:**
   - Update barangay information
   - Customize announcement templates
   - Configure emergency types if needed

---

## 📚 Additional Help

If you encounter issues not covered here:

1. Check the main **README.md** for detailed documentation
2. Review error messages carefully
3. Check internet connection and firewall settings
4. Ensure all terminals are running
5. Contact the developer: LeeDev428

---

<div align="center">
  <h3>🎊 You're all set! Welcome to DREAM System! 🎊</h3>
  <p>Happy emergency response management!</p>
</div>

---

**Last Updated:** November 18, 2025  
**Version:** 1.0.0  
**Developer:** LeeDev428

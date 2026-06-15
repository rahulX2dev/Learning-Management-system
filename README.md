# Full Stack Learning Management System

## 🎉 Project Completed!

A modern, animated Learning Management System built with Next.js 14, TypeScript, MongoDB, and JWT authentication.

## ✨ Features Implemented

### 🔐 Authentication System
- ✅ JWT token-based authentication with HTTP-only cookies
- ✅ User registration with role selection (Student/Instructor/Admin)
- ✅ Secure login/logout functionality
- ✅ Password hashing with bcryptjs
- ✅ Protected routes and role-based access control

### 📚 Course Management
- ✅ Dynamic course listing with search and filters
- ✅ Course detail pages with enrollment functionality
- ✅ Course creation for instructors/admins
- ✅ Module-based curriculum structure
- ✅ Category and level-based organization
- ✅ Enrollment tracking

### 📝 Quiz Module
- ✅ Interactive quiz interface with timer
- ✅ Multiple-choice questions with validation
- ✅ Automatic grading and scoring
- ✅ Pass/fail determination based on passing score
- ✅ Question navigation (previous/next)
- ✅ Quiz creation for instructors/admins
- ✅ Quiz attempts tracking

### 🎨 Premium UI/UX
- ✅ Dark mode design with vibrant gradients
- ✅ Glassmorphism effects throughout
- ✅ Smooth animations with Framer Motion
- ✅ Responsive layouts (mobile, tablet, desktop)
- ✅ Floating animations and micro-interactions
- ✅ Custom scrollbar and loading spinners

### 👨‍💼 Admin Dashboard
- ✅ Course creation interface with module builder
- ✅ Quiz creation interface with question builder
- ✅ Modal-based forms for content management
- ✅ Role-based access (Instructor/Admin only)

### 📊 Additional Features
- ✅ My Courses dashboard for students
- ✅ Learning stats and progress indicators
- ✅ Animated home page with hero section
- ✅ User profile display
- ✅ Responsive navigation bar

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- MongoDB instance (local or cloud)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Edit `.env.local` with your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/lms
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   
   Navigate to `http://localhost:3000`

## 📖 Usage Guide

### For Students:
1. Register as a student
2. Browse available courses
3. Enroll in courses
4. Take quizzes and track your progress

### For Instructors/Admins:
1. Register as an instructor
2. Access the Admin Dashboard
3. Create courses with modules
4. Create quizzes for courses
5. Manage content

## 🎯 Tech Stack

- **Frontend:** Next.js 14, React 19, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT with HTTP-only cookies
- **Icons:** React Icons

## 🌟 Key Highlights

- **Modern Design:** Premium glassmorphism UI with smooth animations
- **Secure:** JWT-based authentication with encrypted cookies
- **Dynamic:** All courses and quizzes are database-driven
- **Responsive:** Works perfectly on all devices
- **Interactive:** Engaging quiz interface with real-time feedback
- **Role-Based:** Different features for students, instructors, and admins

## 📝 Notes

- MongoDB must be running for the application to work
- Default demo credentials shown on login page for testing
- All passwords are securely hashed
- Quiz timer automatically submits when time expires

## ⚠️ Razorpay (Payments) setup

- **Server env variables required:** set the following in your server environment (do NOT expose the secret client-side):
   - `RAZORPAY_KEY_ID` — your Razorpay Key ID
   - `RAZORPAY_KEY_SECRET` — your Razorpay Key Secret

- The code lazily initializes the Razorpay Node client on the server. If `RAZORPAY_KEY_ID` is missing the server will throw a helpful error. If you were using `NEXT_PUBLIC_RAZORPAY_KEY_ID` previously, move the secret to `RAZORPAY_KEY_SECRET` and the key ID to `RAZORPAY_KEY_ID` for server-side usage.

Example `.env.local` entries (do not commit this file):
```
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_secret_here
```

If you want to allow client code to access the key id (public), you can also set `NEXT_PUBLIC_RAZORPAY_KEY_ID`, but never expose the secret.

Enjoy your Learning Management System! 🎓

# ShopHub - Full Stack E-commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, and Firebase authentication.

## 🚀 Features

- **User Authentication**: Firebase-powered sign-in/sign-up with Google OAuth
- **Product Management**: Browse, search, and filter products
- **Shopping Cart**: Add/remove items with quantity controls
- **Order Management**: Complete checkout process with order tracking
- **Shipping Management**: Create and update shipping information
- **Admin Panel**: Product management for administrators
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Firebase** for authentication

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Firebase Admin SDK** for authentication
- **Joi** for validation
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
Da/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── Admin/           # Admin panel components
│   │   ├── Components/      # Reusable components
│   │   ├── Pages/          # Page components
│   │   ├── Redux/          # State management
│   │   └── firebase/       # Firebase configuration
│   └── package.json
├── backend/                 # Node.js backend API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database
- Firebase project

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Da
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp env.example config/.env
   # Edit config/.env with your configuration
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp env.example .env.local
   # Edit .env.local with your configuration
   npm run dev
   ```

4. **Environment Variables**

   **Backend** (`backend/config/.env`):
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_PRIVATE_KEY=your_firebase_private_key
   FIREBASE_CLIENT_EMAIL=your_firebase_client_email
   ```

   **Frontend** (`frontend/.env.local`):
   ```env
   VITE_API_URL=http://localhost:3000
   ```

## 🌐 Deployment

### Backend Deployment (Render)

1. **Connect to Render**
   - Sign up at [render.com](https://render.com)
   - Connect your GitHub repository
   - Create a new Web Service

2. **Environment Variables**
   - Add all environment variables from `backend/env.example`
   - Set `NODE_ENV=production`

3. **Build Settings**
   - Build Command: `npm install`
   - Start Command: `npm start`

### Frontend Deployment (Vercel)

1. **Connect to Vercel**
   - Sign up at [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` directory

2. **Environment Variables**
   - Add `VITE_API_URL` pointing to your backend URL

3. **Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## 📚 API Documentation

### Authentication
- `POST /user/signIn` - User sign in
- `POST /user/signUp` - User sign up

### Products
- `GET /product` - Get all products
- `GET /product/:id` - Get product by ID
- `POST /product` - Create product (Admin)
- `PUT /product/:id` - Update product (Admin)
- `DELETE /product/:id` - Delete product (Admin)

### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Add item to cart
- `PUT /cart/:id` - Update cart item
- `DELETE /cart/:id` - Remove item from cart

### Orders
- `GET /order` - Get user orders
- `POST /order` - Create new order

### Shipping
- `GET /shipping` - Get shipping info
- `POST /shipping` - Create shipping info
- `PUT /shipping/:id` - Update shipping info

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Shopping! 🛍️** 
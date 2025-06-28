const express = require("express")
const dotenv = require("dotenv")
const connectDb = require("./config/db")
const cors = require("cors")
const cookieParser = require("cookie-parser")

// Load environment variables - use local file for development, system env for production
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({
        path: "./config/.env"
    })
} else {
    // In production (like Render), use system environment variables
    dotenv.config()
}

connectDb()
const app = express()

// CORS configuration for production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://shophub-frontend.vercel.app',
    'https://shophub.vercel.app',
    'https://shophub.netlify.app',
    'https://shophub-ecommerce-self.vercel.app'  // Add your Vercel domain
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'idtoken']
}))

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'ShopHub API is running',
        timestamp: new Date().toISOString()
    });
});

// API routes
app.use("/user", require("./routes/userRoute"))
app.use("/product", require("./routes/productRoute"))
app.use("/cart", require("./routes/cartRoute"))
app.use("/shipping", require("./routes/shippingRoute"))
app.use("/order", require("./routes/orderRoute"))

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'Route not found' 
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port: ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📡 Health check: http://localhost:${PORT}/health`);
})
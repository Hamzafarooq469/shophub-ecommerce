const mongoose = require("mongoose")

const connectDb = () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL
        if (!mongoUri) {
            console.error("MongoDB URI not found in environment variables")
            console.error("Please set MONGODB_URI or MONGO_URL environment variable")
            return
        }
        
        mongoose.connect(mongoUri)
        console.log("✅ Database connected successfully")
    } catch (error) {
        console.log("❌ Error connecting database:", error.message)
    }
}

module.exports = connectDb
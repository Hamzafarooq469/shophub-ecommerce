const mongoose = require("mongoose")

const connectDb = () => {
    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL
        if (!mongoUri) {
            console.error("MongoDB URI not found in environment variables")
            return
        }
        
        mongoose.connect(mongoUri)
        console.log("Database connected successfully")
    } catch (error) {
        console.log("Error connecting database:", error.message)
    }
}

module.exports = connectDb
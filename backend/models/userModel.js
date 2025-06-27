
const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    uid: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
}
)

module.exports = mongoose.model("User", userSchema)
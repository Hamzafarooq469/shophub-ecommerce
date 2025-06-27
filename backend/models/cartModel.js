const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // MongoDB user reference
    // firebaseUid: { type: String },  // Firebase UID reference
    user: { type: String, ref: 'User' },
    guestId: { type: String, default: null },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },  // Product reference
    quantity: { type: Number, default: 1, min: 1 },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Cart", cartSchema);

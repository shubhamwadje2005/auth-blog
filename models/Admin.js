const mongoose = require("mongoose")

module.exports = mongoose.model("admin", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    otp: { type: String, },
    otpSendon: { type: Date, },
    // isActive: { type: Boolean, default: true },
}))
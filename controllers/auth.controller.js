const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { differenceInSeconds } = require("date-fns")
const User = require("../models/User")
const Admin = require("../models/Admin")
const { genrateOTP } = require("../utiles/genrateOTP")
const { sendEmail } = require("../utiles/email")


exports.registerUser = asyncHandler(async (req, res) => {
    const { email, mobile, password } = req.body
    const result = await User.findOne({ $or: [{ email }, { mobile }] })
    if (result) {
        return res.status(401).json({ message: "email or mobile already exist" })
    }
    const hash = await bcrypt.hash(password, 10)

    await User.create({ ...req.body, password: hash })

    res.json({ message: "register success" })
})
exports.loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
    if (!result) {
        return res.status(401).json({ message: "email or mobile does not exist" })
    }

    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "invalid password" })
    }

    if (!result.isActive) {
        return res.status(401).json({ message: "account blocked by admin" })
    }
    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    //                                                        👇 securite purpose 
    res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: "login success", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
})
exports.logoutUser = asyncHandler((req, res) => {
    res.clearCookie("USER")
    res.json({ message: "logout success" })
})




exports.registerAdmin = asyncHandler(async (req, res) => {
    await Admin.create(req.body)
    res.json({ message: "admin register success" })
})
exports.sendotp = asyncHandler(async (req, res) => {
    const { username } = req.body
    const result = await Admin.findOne({ $or: [{ email: username }, { mobile: username }] })
    if (!result) {
        return res.status(401).json({ message: "invalid email or mobile" })
    }
    // genrateotp()
    const otp = genrateOTP()
    console.log(otp);
    await Admin.findByIdAndUpdate(result._id, { otp, otpSendon: new Date() })
    // sendEmail()
    sendEmail({
        to: result.email,
        subject: "verify your login otp",
        message: `your otp is ${otp}`
    })
    res.json({ message: "admin otp send success" })
})
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { username, otp } = req.body
    const result = await Admin.findOne({ $or: [{ email: username }, { mobile: username }] })
    if (!result) {
        return res.status(401).json({ message: "invalid email or mobile" })
    }
    if (result.otp != otp) {
        return res.status(401).json({ message: "invalid otp" })
    }

    if (differenceInSeconds(new Date(), result.otpSendon) > 60) {
        return res.status(401).json({ message: "otp expired" })
    }
    await Admin.findByIdAndUpdate(result._id, { otp: null })// 👈 one time use otp
    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    res.cookie("ADMIN", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: "admin login success",
        result: {
            _id: result._id,
            name: result.name,
            email: result.email,
            mobile: result.mobile,
        }
    })
})
exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("ADMIN")
    res.json({ message: "admin logout success" })
})
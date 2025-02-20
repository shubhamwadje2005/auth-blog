const { registerUser, loginUser, logoutUser, registerAdmin, sendotp, loginAdmin, logoutAdmin } = require("../controllers/auth.controller")

const route = require("express").Router()

route
    .post("/register-user", registerUser)
    .post("/login-user", loginUser)
    .post("/logout-user", logoutUser)

    .post("/register-admin", registerAdmin)
    .post("/send-otp", sendotp)
    .post("/login-admin", loginAdmin)
    .post("/logout-admin", logoutAdmin)

module.exports = route
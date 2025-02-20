const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { userProtected, adminProtected } = require("./middleware/auth.middleware")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors({ origin: "https://auth-blog-qk5j.onrender.com", credentials: true }))
app.use(cookieParser())
app.use(express.static("dist"))
app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/user", userProtected, require("./routes/blog.routes"))
app.use("/api/admin", adminProtected, require("./routes/admin.routes"))
app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
    // res.status(404).json({ message: "resource not found !" })
})

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: "server error", error: err.message })
})

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("mongo connected")
    app.listen(process.env.PORT, console.log("server running......"))
})
const asyncHandler = require("express-async-handler")
const cloudinary = require("cloudinary").v2
const upload = require("../utiles/upload")
const Blog = require("../models/Blog")
const path = require("path")

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})
exports.createBlog = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        // console.log(req.file);
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await Blog.create({ ...req.body, user: req.loggInUser, hero: secure_url })
        }
        res.json({ message: "createBlog success" })
    })
})

exports.readBlog = asyncHandler(async (req, res) => {
    const result = await Blog.find({ user: req.loggInUser })
    res.json({ message: "readBlog success", result })
})

exports.updateBlog = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (req.file) {
            const { bid } = req.params
            const result = await Blog.findById(bid)
            await cloudinary.uploader.destroy(path.basename(result.hero).split(".")[0])
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            await Blog.findByIdAndUpdate(req.params.bid, { ...req.body, hero: secure_url })
            res.json({ message: " blog update success" })

        } else {
            await Blog.findByIdAndUpdate(req.params.bid, req.body)
            res.json({ message: "updateBlog success" })
        }
    })
})

exports.deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    const result = await Blog.findById(bid)
    await cloudinary.uploader.destroy(path.basename(result.hero).split(".")[0])
    await Blog.findByIdAndDelete(bid)
    res.json({ message: "deleteBlog success" })
})
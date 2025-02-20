const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const Blog = require("../models/Blog")

exports.getAllUsers = asyncHandler(async (req, res) => {
    //                                            👇 you want
    // const result = await User.find().select("name email")
    //                                           👇 you don't want
    const result = await User.find().select("-password -__v")
    res.json({ message: "getallUser success", result })
})
exports.blockUnblockUserAccount = asyncHandler(async (req, res) => {
    const { uid } = req.params
    await User.findByIdAndUpdate(uid, { isActive: req.body.isActive })
    res.json({ message: "blockUnblockUserAccount success" })
})


exports.getAllBlogs = asyncHandler(async (req, res) => {
    const result = await Blog.find().select("-__v")
    res.json({ message: "getallblogs success", result })
})
exports.publishUnpublishBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params
    await Blog.findByIdAndUpdate(bid, { isPublish: req.body.isPublish })
    res.json({ message: "publishUnpublishBlog success" })
})
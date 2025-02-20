const { createBlog, readBlog, updateBlog, deleteBlog } = require("../controllers/user.controller")

const route = require("express").Router()

route
    .post("/create-blog", createBlog)
    .get("/read-blog", readBlog)
    .patch("/update-blog/:bid", updateBlog)
    .delete("/delete-blog/:bid", deleteBlog)

module.exports = route
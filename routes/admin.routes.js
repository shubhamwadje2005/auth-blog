const { getAllUsers, getAllBlogs, blockUnblockUserAccount, publishUnpublishBlog } = require("../controllers/admin.controller")

const route = require("express").Router()

route
    .get("/users", getAllUsers)
    .get("/blogs", getAllBlogs)
    .patch("/block-unblock-user/:uid", blockUnblockUserAccount)
    .patch("/publish-unpublish-blog/:bid", publishUnpublishBlog)

module.exports = route

const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { request } = require("http")

const storage = multer.diskStorage({
    destination: (request, file, callback) => {
        callback(null, "./image")
    },
    filename: (request, file, callback) => {
        callback(null, `image-${Date.now()}${path.extname(file.originalname)}`) 
    }
})

exports.upload = multer({storage: storage})
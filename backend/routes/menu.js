const express = require(`express`)
const { Model } = require("sequelize")
const app = express()

app.use(express.json())

let menuController = require("../controllers/menuController")
let upImg = require("../middlewares/upImg")
let authorization = require("../middlewares/authorization")

app.get("/", authorization.authorization, menuController.getDataMenu)
app.post("/", [
    upImg.upload.single(`gambar`),
    authorization.authorization,
    menuController.addDataMenu
])
app.put("/:id_menu", [
    upImg.upload.single(`gambar`),
    authorization.authorization,
    menuController.editDataMenu
])
app.delete("/:id_menu", [authorization.authorization], menuController.deleteDataMobil)

module.exports = app
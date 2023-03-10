const express = require(`express`)
const { Model } = require("sequelize")
const app = express()

app.use(express.json())

let userController = require("../controllers/userController")
let authorization = require("../middlewares/authorization")

app.get("/", [authorization.authorization], userController.getDataUser)
app.post("/", userController.addDataUser)
app.post("/auth", userController.authentication)
app.put("/:id_user", [authorization.authorization], userController.editDataUser)
app.delete("/:id_user", [authorization.authorization], userController.deleteDataUser)

module.exports = app
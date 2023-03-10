const express = require(`express`)
const { Model } = require("sequelize")
const app = express()

app.use(express.json())

let mejaController = require("../controllers/mejaController")
let authorization = require("../middlewares/authorization")

app.get("/", [authorization.authorization], mejaController.getDataMeja)
app.get("/ready", [authorization.authorization], mejaController.getMejaReady)
app.post("/", [authorization.authorization], mejaController.addDataMeja)
app.put("/:id_meja", [authorization.authorization], mejaController.editDataMeja)
app.delete("/:id_meja",[authorization.authorization], mejaController.deleteDataMeja)

module.exports = app
const express = require(`express`)
const { Model } = require("sequelize")
const app = express()

app.use(express.json())

let transaksiController = require("../controllers/transaksiController")
let authorization = require("../middlewares/authorization")

app.get("/", [authorization.authorization], transaksiController.getTransaksi)
app.post("/", [authorization.authorization], transaksiController.addTransaksi)
app.post("/filter", [authorization.authorization], transaksiController.filter)
app.put("/:id_transaksi", [authorization.authorization], transaksiController.editTransaksi)
app.delete("/:id_transaksi", [authorization.authorization], transaksiController.deleteTransaksi)

module.exports = app
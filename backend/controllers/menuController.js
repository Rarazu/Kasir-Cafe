const { error } = require("console")
const {request, response} = require("express");

let modelMenu = require("../models/index").menu
let path = require("path")
let fs = require("fs");
const req = require("express/lib/request");

exports.getDataMenu = (request, response) => {
    modelMenu.findAll()
    .then(result => {
        return response.json(result)
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.addDataMenu = (request, response) => {
    if (!request.file) {
        return response.json({
            message: `Gambar belum diupload`
        })
    }
    let newMenu = {
        nama_menu: request.body.nama_menu,
        jenis: request.body.jenis,
        deskripsi: request.body.deskripsi,
        gambar: request.file.filename,
        harga: request.body.harga
    }

    modelMenu.create(newMenu)
    .then(result => {
        return response.json({
            message: `Data menu berhasil ditambahkan`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.editDataMenu = async(request, response) => {
    let id = request.params.id_menu
    let dataMenu = {
        nama_menu: request.body.nama_menu,
        jenis: request.body.jenis,
        deskripsi: request.body.deskripsi,
        harga: request.body.harga
    }

    if (request.file) {
        let menu = await modelMenu.findOne({where: {id_menu: id}})
        let oldFileName = menu.gambar

        let location = path.join(__dirname, "../image", oldFileName)
        fs.unlink(location, error => console.log(error))

        dataMenu.gambar = request.file.filename
    }

    modelMenu.update(dataMenu, {where:{id_menu: id}})
    .then(result => {
        return response.json({
            message: `Data menu berhasil diedit`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.deleteDataMobil = async(request, response) => {
    let id = request.params.id_menu
    let menu = await modelMenu.findOne({where: {id_menu: id}})
    if (menu) {
        let oldFileName = menu.gambar
        let location = path.join(__dirname,"../image", oldFileName)
        fs.unlink(location, error => console.log(error))
    }

    modelMenu.destroy({where: {id_menu: id}})
    .then(result => {
        return response.json({
            message: `Data menu berhasil dihapus`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}
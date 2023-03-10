const {request, response} = require("express");
const req = require("express/lib/request");

let transaksiModel = require("../models/index").transaksi
let userModel = require("../models/index").user
let mejaModel = require("../models/index").meja
let menuModel = require("../models/index").menu
let detailTransaksiModel = require("../models/index").detail_transaksi

exports.getTransaksi = async(request, response) => {
    let data = await transaksiModel.findAll({
        include : ["user", "meja", {
            model: detailTransaksiModel,
            as: "detail_transaksi",
            include: ["menu"]
        }]
    })
    return response.json(data)
}

exports.filter = async(request, response) => {
    let start = request.body.start
    let end = request.body.end
    let id_user = request.body.id_user

    let sequelize = require(`sequelize`)
    let Op = sequelize.Op

    let parameter = {
        tgl_transaksi: {[Op.between] : [start, end]}
    }

    if (id_user !== '') {
        parameter.id_user = id_user
    }

    let data = await transaksiModel.findAll({
        include : ["user", "meja", {
            model: detailTransaksiModel,
            as: "detail_transaksi",
            include: ["menu"]
        }],
        where : parameter
    })
    return response.json(data)
}

exports.addTransaksi = async(request, response) => {
    let total = 0
    let detail = request.body.detail_transaksi
    for (let i = 0; i < detail.length; i++) {
        let menu = await menuModel.findOne({
            where: {id_menu: detail[i].id_menu}
        })
        let hargaMenu = menu.harga
        detail[i].harga = hargaMenu
    }

    let newTransaksi = {
        tgl_transaksi: request.body.tgl_transaksi,
        id_user: request.body.id_user,
        id_meja: request.body.id_meja,
        nama_pelanggan: request.body.nama_pelanggan,
        status: "belum_bayar",
    }

    transaksiModel.create(newTransaksi)
    .then(result => {
        let id = result.id_transaksi
        for (let i = 0; i < detail.length; i++) {
            detail[i].id_transaksi = id
        }

        detailTransaksiModel.bulkCreate(detail)
        .then(result => {
            return response.json({
                message: `Data Transaksi berhasil ditambahkan`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.editTransaksi = async(request, response) => {
    let id = request.params.id_transaksi

    let detail = request.body.detail_transaksi
    for (let i = 0; i < detail.length; i++) {
        let menu = await menuModel.findOne({
            where: {id_menu: detail[i].id_menu}
        })
        let hargaMenu = menu.harga
        detail[i].harga = hargaMenu
    }

    let dataTransaksi = {
        tgl_transaksi: request.body.tgl_transaksi,
        id_user: request.body.id_user,
        id_meja: request.body.id_meja,
        nama_pelanggan: request.body.nama_pelanggan,
        status: request.body.status,
    }

    transaksiModel.update(
        dataTransaksi, {where: {id_transaksi: id}}
    )
    .then(async result => {
        await detailTransaksiModel.destroy(
            {where: {
                id_transaksi: request.params.id_transaksi
            }}
        )
        let detail_transaksi = request.body.detail_transaksi
        let id = request.params.id_transaksi
        for (let i = 0; i < detail_transaksi.length; i++) {
            detail_transaksi[i].id_transaksi = id
        }

        detailTransaksiModel.bulkCreate(detail_transaksi)
        .then(result => {
            return response.json({
                message: `Data transaksi berhasil diupdate`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => console.log(error))
}

exports.deleteTransaksi = (request, response) => {
    let id = request.params.id_transaksi

    detailTransaksiModel.destroy({
        where: {
            id_transaksi: id
        }
    })
    .then(result => {
        let id = request.params.id_transaksi

        transaksiModel.destroy({
            where: {
                id_transaksi: id
            }
        })
        .then(result => {
            return response.json({
                message: `Data transaksi berhasil dihapus`
            })
        })
        .catch(error => {
            return response.json({
                message: error.message
            })
        })
    })
    .catch(error => console.log(error))
}
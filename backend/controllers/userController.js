const md5 = require("md5");
const {request, response} = require("express");
const req = require("express/lib/request");

let jwt = require("jsonwebtoken")
let modelUser = require("../models/index").user

exports.getDataUser = (request, response) => {
    modelUser.findAll()
    .then(result => {
        return response.json(result)
    })
    .catch(error => {
        message: error.message
    })
}

exports.addDataUser = (request, response) => {
    let newUser = {
        nama_user: request.body.nama_user,
        role: request.body.role,
        username: request.body.username,
        password: md5(request.body.password)
    }

    modelUser.create(newUser)
    .then(result => {
        return response.json({
            message: `Data user berhasil ditambahkan`
        })
    })
    .catch(error => {
        message: error.message
    })
}

exports.editDataUser = (request, response) => {
    let id = request.params.id_user
    let dataUser = {
        nama_user: request.body.nama_user,
        role: request.body.role,
        username: request.body.username,
        password: md5(request.body.password)
    }

    modelUser.update(dataUser, {where:{id_user: id}})
    .then(result => {
        return response.json({
            message: `Data user berhasil diubah`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.deleteDataUser = (request, response) => {
    let id = request.params.id_user

    modelUser.destroy({where: {id_user: id}})
    .then(result => {
        return response.json({
            message: `Data user berhasil dihapus`
        })
    })
    .catch(error => {
        return response.json({
            message: error.message
        })
    })
}

exports.authentication = async(request, response) => {
    let data = {
        username: request.body.username,
        password: md5(request.body.password)
    }

    let result = await modelUser.findOne({where: data})

    if (result) {
        let payload = JSON.stringify(result) 
        let secretKey = `Sequelize itu sangat menyenangkan`

        let token = jwt.sign(payload, secretKey)
        return response.json({
            logged: true,
            token: token,
            dataUser: result
        })
    } else{
        return response.json({
            logged: false,
            message: `Invalid username or password`
        })
    }
}
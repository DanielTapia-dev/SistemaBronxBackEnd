const clientes = require("../models").clientes;

function create(req, res) {
    clientes
        .create(req.body)
        .then((clientes) => {
            res.status(200).send({ clientes });
        })
        .catch((err) => {
            res.status(500).send({ err });
        });
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;
    clientes
        .findOne({
            where: {
                idcliente: id,
            },
        })
        .then((cliente) => {
            cliente
                .update(body)
                .then(() => {
                    res.status(200).send({ cliente });
                })
                .catch((erro) => {
                    res
                        .status(500)
                        .send({ message: "Ocurrio un error al actualizar el cliente, " + erro });
                });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al actualizar el cliente, " + err });
        });
}

function getOne(req, res) {
    var idcliente = req.params.id;
    clientes
        .findOne({
            where: {
                idcliente: idcliente,
            },
        })
        .then((cliente) => {
            res.status(200).send(cliente);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar el Cliente." + err });
        });
}

function getOnePorCedula(req, res) {
    var idcliente = req.params.id;
    clientes
        .findOne({
            where: {
                ruccicliente: idcliente,
            },
        })
        .then((cliente) => {
            res.status(200).send(cliente);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar el Cliente." + err });
        });
}

function getAll(req, res) {
    var idEmpresa = req.params.id;
    clientes
        .findAll({
            where: {
                idempresa: idEmpresa,
            },
        })
        .then((clientes) => {
            res.status(200).send({ clientes });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al buscar los clientes" });
        });
}

function getAllCredito(req, res) {
    var idEmpresa = req.params.id;
    clientes
        .findAll({
            where: {
                idempresa: idEmpresa,
                tipocliente: 'Credito'
            },
        })
        .then((clientes) => {
            res.status(200).send({ clientes });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al buscar los clientes" });
        });
}


function borrar(req, res) {
    var id = req.params.id;
    var body = req.body;
    clientes
        .findOne({
            where: {
                idcliente: id,
            },
        })
        .then((cliente) => {
            cliente
                .destroy(body)
                .then(() => {
                    res.status(200).send({ message: "Cliente eliminado" });
                })
                .catch((erro) => {
                    res
                        .status(500)
                        .send({ message: "Ocurrio un error al borrar el cliente" });
                });
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrio un error al borrar el cliente" });
        });
}

module.exports = {
    create,
    update,
    getAll,
    borrar,
    getOne,
    getOnePorCedula,
    getAllCredito
};
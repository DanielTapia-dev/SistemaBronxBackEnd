const clientes = require('../models').clientes;

function create(req, res) {
    clientes.create(req.body).then(clientes => {
        res.status(200).send({ clientes });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    clientes.getById(id)
        .then(cliente => {
            cliente.update(body)
                .then(() => {
                    res.status(200).send({ cliente });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar el cliente" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al actualizar el cliente" });
        });
}

function getAll(req, res) {
    clientes.findAll()
        .then(clientes => {
            res.status(200).send({ clientes });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar los clientes" });
        })
}

module.exports = {
    create,
    update,
    getAll
}
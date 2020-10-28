const parformapago = require('../models').parformapago;

function create(req, res) {
    parformapago.create(req.body).then(parformapago => {
        res.status(200).send({ parformapago });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    parformapago.findOne({
            where: {
                idformapago: id
            }
        })
        .then(formapago => {
            formapago.update(body)
                .then(() => {
                    res.status(200).send({ formapago });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar la forma de pago" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error actualizar la forma de pago - No se encontro la forma de pago" });
        });
}

function getAll(req, res) {
    parformapago.findAll()
        .then(parformapago => {
            res.status(200).send({ parformapago });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las formas de pago" });
        })
}

module.exports = {
    create,
    update,
    getAll
}
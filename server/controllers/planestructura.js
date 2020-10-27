const planestructura = require('../models').planestructura;

function create(req, res) {
    planestructura.create(req.body).then(planestructura => {
        res.status(200).send({ planestructura });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    planestructura.findOne({
            where: {
                idempresa: id
            }
        })
        .then(planestruc => {
            planestruc.update(body)
                .then(() => {
                    res.status(200).send({ planestruc });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar la estructura del plan" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error actualizar la estructura del plan - No se encontro la estructura del plan" });
        });
}

function getAll(req, res) {
    planestructura.findAll()
        .then(planestructura => {
            res.status(200).send({ planestructura });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las estructura del plan" });
        })
}

module.exports = {
    create,
    update,
    getAll
}
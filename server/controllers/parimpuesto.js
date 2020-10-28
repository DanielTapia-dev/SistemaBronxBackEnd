const parimpuesto = require('../models').parimpuesto;

function create(req, res) {
    parimpuesto.create(req.body).then(parimpuesto => {
        res.status(200).send({ parimpuesto });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    parimpuesto.findOne({
            where: {
                idimpuesto: id
            }
        })
        .then(impuesto => {
            impuesto.update(body)
                .then(() => {
                    res.status(200).send({ impuesto });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar el impuesto" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error actualizar el impuesto - No se encontro el impuesto" });
        });
}

function getAll(req, res) {
    parimpuesto.findAll()
        .then(parimpuesto => {
            res.status(200).send({ parimpuesto });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar los impuestos" });
        })
}

module.exports = {
    create,
    update,
    getAll
}
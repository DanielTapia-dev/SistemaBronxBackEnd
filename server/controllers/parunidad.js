const parunidad = require('../models').parunidad;

function create(req, res) {
    parunidad.create(req.body).then(parunidad => {
        res.status(200).send({ parunidad });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    parunidad.findOne({
            where: {
                idunidad: id
            }
        })
        .then(unidad => {
            unidad.update(body)
                .then(() => {
                    res.status(200).send({ unidad });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar la unidad" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error actualizar la unidad - No se encontro la unidad" });
        });
}

function getAll(req, res) {
    parunidad.findAll()
        .then(parunidad => {
            res.status(200).send({ parunidad });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las unidades" });
        })
}

module.exports = {
    create,
    update,
    getAll
}
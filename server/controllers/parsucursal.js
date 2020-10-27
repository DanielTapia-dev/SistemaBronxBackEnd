const parsucursal = require('../models').parsucursal;

function create(req, res) {
    parsucursal.create(req.body).then(parsucursal => {
        res.status(200).send({ parsucursal });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    parsucursal.findOne({
            where: {
                idsucursal: id
            }
        })
        .then(sucur => {
            sucur.update(body)
                .then(() => {
                    res.status(200).send({ sucur });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar la sucursal" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al actualizar el sucursal - No se encontro la sucursal" });
        });
}

function getAll(req, res) {
    parsucursal.findAll()
        .then(parsucursal => {
            res.status(200).send({ parsucursal });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las sucursales" });
        })
}

module.exports = {
    create,
    update,
    getAll
}
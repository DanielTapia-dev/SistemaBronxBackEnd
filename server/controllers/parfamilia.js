const parfamilia = require('../models').parfamilia;

function create(req, res) {
    parfamilia.create(req.body).then(parfamilia => {
        res.status(200).send({ parfamilia });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    parfamilia.findOne({
            where: {
                idfamilia: id
            }
        })
        .then(familia => {
            familia.update(body)
                .then(() => {
                    res.status(200).send({ familia });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar la familia" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error actualizar la familia - No se encontro la familia" });
        });
}

function getAll(req, res) {
    parfamilia.findAll()
        .then(parfamilia => {
            res.status(200).send({ parfamilia });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las familias" });
        })
}

module.exports = {
    create,
    update,
    getAll
}
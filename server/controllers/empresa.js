const empresa = require('../models').empresa;

function create(req, res) {
    empresa.create(req.body).then(empresa => {
        res.status(200).send({ empresa });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    empresa.findOne({
            where: {
                idempresa: id
            }
        })
        .then(emp => {
            emp.update(body)
                .then(() => {
                    res.status(200).send({ emp });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar la empresa" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al actualizar el empresa" });
        });
}

function getAll(req, res) {
    empresa.findAll()
        .then(empresa => {
            res.status(200).send({ empresa });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las empresa" });
        })
}

module.exports = {
    create,
    update,
    getAll
}
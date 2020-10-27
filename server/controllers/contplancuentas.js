const contplancuentas = require('../models').contplancuentas;

function create(req, res) {
    contplancuentas.create(req.body).then(contplancuentas => {
        res.status(200).send({ contplancuentas });
    }).catch(err => {
        res.status(500).send({ err });
    })
}

function update(req, res) {
    var id = req.params.id;
    var body = req.body;

    contplancuentas.findOne({
            where: {
                idcuenta: id
            }
        })
        .then(plancuenta => {
            plancuenta.update(body)
                .then(() => {
                    res.status(200).send({ plancuenta });
                })
                .catch(erro => {
                    res.status(500).send({ message: "Ocurrio un error al actualizar la cuenta contable" });
                })
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error actualizar la cuenta contable - No se encontro la cuenta contable" });
        });
}

function getAll(req, res) {
    contplancuentas.findAll()
        .then(contplancuentas => {
            res.status(200).send({ contplancuentas });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las cuentas contables" });
        })
}

function getAllMov(req, res) {
    contplancuentas.findAll({
            where: {
                tipocuenta: true
            }
        })
        .then(contplancuentas => {
            res.status(200).send({ contplancuentas });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las cuentas contables" });
        })
}


module.exports = {
    create,
    update,
    getAll,
    getAllMov
}
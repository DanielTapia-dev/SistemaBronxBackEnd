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
    var idempresa = req.params.id;
    contplancuentas.findAll({
        where: {
            idempresa: idempresa
        }
    })
        .then(contplancuentas => {
            res.status(200).send({ contplancuentas });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar las cuentas contables" });
        })
}

function getAllMov(req, res) {
    var idempresa = req.params.id;
    contplancuentas.findAll({
            where: {
                idempresa: idempresa,
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

function getOne(req, res) {
    var id = req.params.id;
    contplancuentas
      .findOne({
        where: {
          idcuenta: id,
        },
      })
      .then((contplancuentas) => {
        res.status(200).send(contplancuentas);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrió un error al buscar la cuentas contable" + err });
      });
}



function borrar(req, res) {
    var id = req.params.id;
    var body = req.body;
    contplancuentas
      .findOne({
        where: {
          idcuenta: id,
        },
      })
      .then((cuentas) => {
        cuentas
          .destroy(body)
          .then(() => {
            res.status(200).send({ message: "Cuenta eliminada" });
          })
          .catch((erro) => {
            res
              .status(500)
              .send({ message: "Ocurrio un error al borrar la cuenta" });
          });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrio un error al borrar la cuenta" });
      });
  }


module.exports = {
    create,
    update,
    getAll,
    getAllMov,
    borrar,
    getOne
}
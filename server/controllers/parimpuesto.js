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
    var idEmpresa = req.params.id;
    parimpuesto.findAll({
            where: {
                idempresa: idEmpresa,
            },
        })
        .then(parimpuesto => {
            res.status(200).send({ parimpuesto });
        })
        .catch(err => {
            res.status(500).send({ message: "Ocurrio un error al buscar los impuestos" });
        })
}

function getOne(req, res) {
    var idimpuesto = req.params.id;
    parimpuesto.findOne({
            where: {
                idimpuesto: idimpuesto,
            },
        })
        .then((parimpuesto) => {
            res.status(200).send(parimpuesto);
        })
        .catch((err) => {
            res
                .status(500)
                .send({ message: "Ocurrió un error al buscar la forma de pago." + err });
        });
}

function borrar(req, res) {
    var id = req.params.id;
    var body = req.body;
    parimpuesto
      .findOne({
        where: {
          idimpuesto: id,
        },
      })
      .then((impuesto) => {
        impuesto
          .destroy(body)
          .then(() => {
            res.status(200).send({ message: "Impuesto eliminado" });
          })
          .catch((erro) => {
            res
              .status(500)
              .send({ message: "Ocurrio un error al borrar el impuesto" });
          });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrio un error al borrar la unidad" });
      });
  }

module.exports = {
    create,
    update,
    getAll,
    getOne,
    borrar
}
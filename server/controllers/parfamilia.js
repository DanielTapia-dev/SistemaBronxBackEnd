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
    var idEmpresa = req.params.id;
    parfamilia
      .findAll({
        where: {
          idempresa: idEmpresa,
        },
      })
      .then((parfamilia) => {
        res.status(200).send({ parfamilia });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrio un error al buscar las familias" });
      });
  }

function getOne(req, res) {
    var idparfamilia = req.params.id;
    parfamilia
      .findOne({
        where: {
          idfamilia: idparfamilia,
        },
      })
      .then((parfamilia) => {
        res.status(200).send(parfamilia);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrió un error al buscar la familia" + err });
      });
}

function borrar(req, res) {
    var id = req.params.id;
    var body = req.body;
    parfamilia
      .findOne({
        where: {
          idsucursal: id,
        },
      })
      .then((familia) => {
        familia
          .destroy(body)
          .then(() => {
            res.status(200).send({ message: "Familia eliminada" });
          })
          .catch((erro) => {
            res
              .status(500)
              .send({ message: "Ocurrio un error al borrar la familia" });
          });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrio un error al borrar la familia" });
      });
  }


module.exports = {
    create,
    update,
    getAll,
    getOne,
    borrar
}
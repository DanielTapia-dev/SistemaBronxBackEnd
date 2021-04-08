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
    var idEmpresa = req.params.id;
    parsucursal
      .findAll({
        where: {
          idempresa: idEmpresa,
        },
      })
      .then((parsucursal) => {
        res.status(200).send({ parsucursal });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrio un error al buscar la sucursal" });
      });
  }

function getOne(req, res) {
    var idparsucursal = req.params.id;
    parsucursal
      .findOne({
        where: {
          idsucursal: idparsucursal,
        },
      })
      .then((parsucursal) => {
        res.status(200).send(parsucursal);
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrió un error al buscar la sucursal" + err });
      });
}

function borrar(req, res) {
    var id = req.params.id;
    var body = req.body;
    parsucursal
      .findOne({
        where: {
          idsucursal: id,
        },
      })
      .then((sucursal) => {
        sucursal
          .destroy(body)
          .then(() => {
            res.status(200).send({ message: "Sucursal eliminada" });
          })
          .catch((erro) => {
            res
              .status(500)
              .send({ message: "Ocurrio un error al borrar la sucursal" });
          });
      })
      .catch((err) => {
        res
          .status(500)
          .send({ message: "Ocurrio un error al borrar la sucursal" });
      });
  }
  

module.exports = {
    create,
    update,
    getAll,
    getOne,
    borrar
}
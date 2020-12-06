const parformapago = require("../models").parformapago;

function create(req, res) {
  parformapago
    .create(req.body)
    .then((parformapago) => {
      res.status(200).send({ parformapago });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;

  parformapago
    .findOne({
      where: {
        idformapago: id,
      },
    })
    .then((formapago) => {
      formapago
        .update(body)
        .then(() => {
          res.status(200).send({ formapago });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({
              message: "Ocurrio un error al actualizar la forma de pago",
            });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message:
            "Ocurrio un error actualizar la forma de pago - No se encontro la forma de pago",
        });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  parformapago
    .findOne({
      where: {
        idformapago: id,
      },
    })
    .then((formapago) => {
      formapago
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Forma de pago eliminada" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la forma de pago 1" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la forma de pago 2" });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  parformapago
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((parformapago) => {
      res.status(200).send({ parformapago });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las formas de pago" });
    });
}

function getOne(req, res) {
  var idformapago = req.params.id;
  parformapago
    .findOne({
      where: {
        idformapago: idformapago,
      },
    })
    .then((parformapago) => {
      res.status(200).send(parformapago);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la forma de pago." + err });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

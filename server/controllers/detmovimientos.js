const detmovimientos = require("../models").detmovimientos;

function create(req, res) {
  detmovimientos
    .create(req.body)
    .then((detmovimientos) => {
      res.status(200).send({ detmovimientos });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  detmovimientos
    .findOne({
      where: {
        secmovdet: id,
      },
    })
    .then((detmovimiento) => {
        detmovimiento
        .update(body)
        .then(() => {
          res.status(200).send({ detmovimiento });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar el detalle de la factura" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar el detalle de la factura" });
    });
}

function getOne(req, res) {
  var id = req.params.id;
  detmovimientos
    .findOne({
      where: {
        secmovdet: id,
      },
    })
    .then((detmovimiento) => {
      res.status(200).send(detmovimiento);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la línea de la factura" + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  detmovimientos
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((detmovimientos) => {
      res.status(200).send({ detmovimientos });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las líneas de la factura" });
    });
}


function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  detmovimientos
    .findOne({
      where: {
        secmovdet: id,
      },
    })
    .then((detmovimiento) => {
      detmovimiento
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Línea de factura eliminada" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la línea de la factura" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la línea de la factura" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

const detcobro = require("../models").detcobro;

function create(req, res) {
  detcobro
    .create(req.body)
    .then((detcobro) => {
      res.status(200).send({ detcobro });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  detcobro
    .findOne({
      where: {
        detcabcob: id,
      },
    })
    .then((dcobro) => {
        dcobro
        .update(body)
        .then(() => {
          res.status(200).send({ dcobro });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar la línea de cobro" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar la línea de cobro" });
    });
}

function getOne(req, res) {
  var id = req.params.id;
  detcobro
    .findOne({
      where: {
        detcabcob: id,
      },
    })
    .then((dcobro) => {
      res.status(200).send(dcobro);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la línea de cobro." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  detcobro
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((detcobro) => {
      res.status(200).send({ detcobro });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las líneas de cobro" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  detcobro
    .findOne({
      where: {
        secdetcob: id,
      },
    })
    .then((dcobro) => {
        dcobro
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Línea de cobro eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la línea de cobro" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la línea de cobro" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

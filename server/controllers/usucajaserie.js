const usucajaserie = require("../models").usucajaserie;

function create(req, res) {
  usucajaserie
    .create(req.body)
    .then((usucajaserie) => {
      res.status(200).send({ usucajaserie });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  usucajaserie
    .findOne({
      where: {
        sectabla: id,
      },
    })
    .then((ucajaserie) => {
      ucajaserie
        .update(body)
        .then(() => {
          res.status(200).send({ ucajaserie });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar el usuario " });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar el usuario" });
    });
}

function getOne(req, res) {
  var idsectabla = req.params.id;
  usucajaserie
    .findOne({
      where: {
        sectabla: idsectabla,
      },
    })
    .then((usucajaserie) => {
      res.status(200).send(usucajaserie);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar el usuario." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  usucajaserie
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((usucajaserie) => {
      res.status(200).send({ usucajaserie });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar los usuarios" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  usucajaserie
    .findOne({
      where: {
        sectabla: id,
      },
    })
    .then((ucajaserie) => {
      ucajaserie
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Registro eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar el registro" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar el registro" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
}

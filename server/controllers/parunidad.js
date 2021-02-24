const parunidad = require("../models").parunidad;

function create(req, res) {
  parunidad
    .create(req.body)
    .then((parunidad) => {
      res.status(200).send({ parunidad });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  parunidad
    .findOne({
      where: {
        idunidad: id,
      },
    })
    .then((unidad) => {
      unidad
        .update(body)
        .then(() => {
          res.status(200).send({ unidad });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar la unidad" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar la unidad" });
    });
}

function getOne(req, res) {
  var idparunidad = req.params.id;
  parunidad
    .findOne({
      where: {
        idunidad: idparunidad,
      },
    })
    .then((parunidad) => {
      res.status(200).send(parunidad);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la unidad." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  parunidad
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((parunidad) => {
      res.status(200).send({ parunidad });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las unidades" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  parunidad
    .findOne({
      where: {
        idunidad: id,
      },
    })
    .then((unidad) => {
      unidad
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Unidad eliminada" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la unidad" });
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
  borrar,
  getOne
}

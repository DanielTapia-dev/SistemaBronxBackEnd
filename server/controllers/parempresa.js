const parempresa = require("../models").parempresa;

function create(req, res) {
  parempresa
    .create(req.body)
    .then((parempresa) => {
      res.status(200).send({ parempresa });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  parempresa
    .findOne({
      where: {
        idempresa: id,
      },
    })
    .then((pempresa) => {
      pempresa
        .update(body)
        .then(() => {
          res.status(200).send({ pempresa });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar los parámetros de la empresa" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar los parámetros de la empresa" });
    });
}

function getOne(req, res) {
  var idEmpresa = req.params.id;
  parempresa
    .findOne({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((parempresa) => {
      res.status(200).send(parempresa);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar los parámetros de la empresa." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  parempresa
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((parempresa) => {
      res.status(200).send({ parempresa });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar los parámetros de la empresa" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  parempresa
    .findOne({
      where: {
        idempresa: id,
      },
    })
    .then((pempresa) => {
      pempresa
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Parámetros de la empresa eliminados" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar los parámetros de la empresa" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar los parámetros de la empresa" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
}
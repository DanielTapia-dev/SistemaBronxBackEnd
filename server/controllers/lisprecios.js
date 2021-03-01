const lisprecios = require("../models").lisprecios;

function create(req, res) {
  lisprecios
    .create(req.body)
    .then((lisprecios) => {
      res.status(200).send({ lisprecios });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  lisprecios
    .findOne({
      where: {
        secpre: id,
      },
    })
    .then((lprecio) => {
      lprecio
        .update(body)
        .then(() => {
          res.status(200).send({ lprecio });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar la lista de precios" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar la lista de precios" });
    });
}

function getOne(req, res) {
  var idprecio = req.params.id;
  lisprecios
    .findOne({
      where: {
        secpre: idprecio,
      },
    })
    .then((lisprecios) => {
      res.status(200).send(lisprecios);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la lista de precios" + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  lisprecios
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((lisprecios) => {
      res.status(200).send({ lisprecios });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las listas de precio" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  lisprecios
    .findOne({
      where: {
        secpre: id,
      },
    })
    .then((tprecio) => {
      tprecio
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Lista de precios eliminada" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la lista de precios" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la lista de precios" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
}

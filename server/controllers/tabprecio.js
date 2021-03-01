const tabprecio = require("../models").tabprecio;

function create(req, res) {
  tabprecio
    .create(req.body)
    .then((tabprecio) => {
      res.status(200).send({ tabprecio });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  tabprecio
    .findOne({
      where: {
        lisprecio: id,
      },
    })
    .then((tprecio) => {
      tprecio
        .update(body)
        .then(() => {
          res.status(200).send({ tprecio });
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
  var idtabprecio = req.params.id;
  tabprecio
    .findOne({
      where: {
        lisprecio: idtabprecio,
      },
    })
    .then((tabprecio) => {
      res.status(200).send(tabprecio);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la lista de precios" + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  tabprecio
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((tabprecio) => {
      res.status(200).send({ tabprecio });
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
  tabprecio
    .findOne({
      where: {
        lisprecio: id,
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

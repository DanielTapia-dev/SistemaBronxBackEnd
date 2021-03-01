const precioclientes = require("../models").precioclientes;

function create(req, res) {
  precioclientes
    .create(req.body)
    .then((precioclientes) => {
      res.status(200).send({ precioclientes });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  precioclientes
    .findOne({
      where: {
        secprecli: id,
      },
    })
    .then((clprecio) => {
      clprecio
        .update(body)
        .then(() => {
          res.status(200).send({ clprecio });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar el precio" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar el precio" });
    });
}

function getOne(req, res) {
  var idprecio = req.params.id;
  precioclientes
    .findOne({
      where: {
        secprecli: idprecio,
      },
    })
    .then((precioclientes) => {
      res.status(200).send(precioclientes);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la lista de precios" + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  precioclientes
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((precioclientes) => {
      res.status(200).send({ precioclientes });
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
  precioclientes
    .findOne({
      where: {
        secprecli: id,
      },
    })
    .then((clprecio) => {
      clprecio
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

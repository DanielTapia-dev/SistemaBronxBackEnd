const parserie = require("../models").parserie;

function create(req, res) {
  parserie
    .create(req.body)
    .then((parserie) => {
      res.status(200).send({ parserie });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  parserie
    .findOne({
      where: {
        idserie: id,
      },
    })
    .then((parserie) => {
      parserie
        .update(body)
        .then(() => {
          res.status(200).send({ parserie });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar la serie" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar la serie" });
    });
}

function getOne(req, res) {
  var idparserie = req.params.id;
  parserie
    .findOne({
      where: {
        idserie: idparserie,
      },
    })
    .then((parserie) => {
      res.status(200).send(parserie);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la serie." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  parserie
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((parserie) => {
      res.status(200).send({ parserie });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las series" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  parserie
    .findOne({
      where: {
        idserie: id,
      },
    })
    .then((parserie) => {
      parserie
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Serie eliminada" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la serie" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la serie" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
}

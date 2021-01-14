const parcaja = require("../models").parcaja;

function create(req, res) {
  parcaja
    .create(req.body)
    .then((parcaja) => {
      res.status(200).send({ parcaja });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  parcaja
    .findOne({
      where: {
        idcaja: id,
      },
    })
    .then((parcaja) => {
      parcaja
        .update(body)
        .then(() => {
          res.status(200).send({ parcaja });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar la caja" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar la caja" });
    });
}

function getOne(req, res) {
  var idparcaja = req.params.id;
  parcaja
    .findOne({
      where: {
        idcaja: idparcaja,
      },
    })
    .then((parcaja) => {
      res.status(200).send(parcaja);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la caja." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  parcaja
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((parcaja) => {
      res.status(200).send({ parcaja });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las cajas" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  parcaja
    .findOne({
      where: {
        idcaja: id,
      },
    })
    .then((parcaja) => {
      parcaja
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "caja eliminada" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la caja" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la caja" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
}

const cabcobro = require("../models").cabcobro;

function create(req, res) {
  cabcobro
    .create(req.body)
    .then((cabcobro) => {
      res.status(200).send({ cabcobro });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  cabcobro
    .findOne({
      where: {
        seccabcob: id,
      },
    })
    .then((ccobro) => {
        ccobro
        .update(body)
        .then(() => {
          res.status(200).send({ ccobro });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar el cobro" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar el cobro" });
    });
}

function getOne(req, res) {
  var id = req.params.id;
  cabcobro
    .findOne({
      where: {
        seccabcob: id,
      },
    })
    .then((ccobro) => {
      res.status(200).send(ccobro);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar el cobro." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  cabcobro
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((cabcobro) => {
      res.status(200).send({ cabcobro });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar los cobros" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  cabcobro
    .findOne({
      where: {
        seccabcob: id,
      },
    })
    .then((ccobro) => {
        ccobro
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Cobro eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar el cobro" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar el cobro" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

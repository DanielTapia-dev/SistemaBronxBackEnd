const detasiento = require("../models").detasiento;

function create(req, res) {
  detasiento
    .create(req.body)
    .then((detasiento) => {
      res.status(200).send({ detasiento });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  detasiento
    .findOne({
      where: {
        secdetasi: id,
      },
    })
    .then((dasiento) => {
        dasiento
        .update(body)
        .then(() => {
          res.status(200).send({ dasiento });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar la línea de asiento" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar la línea de asiento" });
    });
}

function getOne(req, res) {
  var id = req.params.id;
  detasiento
    .findOne({
      where: {
        secdetasi: id,
      },
    })
    .then((dasiento) => {
      res.status(200).send(dasiento);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la línea de asiento." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  detasiento
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((detasiento) => {
      res.status(200).send({ detasiento });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las líneas de asiento" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  detasiento
    .findOne({
      where: {
        secdetasi: id,
      },
    })
    .then((dasiento) => {
        dasiento
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Línea de asiento eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la línea de asiento" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la línea de asiento" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

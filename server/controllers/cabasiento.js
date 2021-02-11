const cabasiento = require("../models").cabasiento;

function create(req, res) {
  cabasiento
    .create(req.body)
    .then((cabasiento) => {
      res.status(200).send({ cabasiento });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  cabasiento
    .findOne({
      where: {
        seccabasi: id,
      },
    })
    .then((casiento) => {
        casiento
        .update(body)
        .then(() => {
          res.status(200).send({ casiento });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar el asiento" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar el asiento" });
    });
}

function getOne(req, res) {
  var id = req.params.id;
  cabasiento
    .findOne({
      where: {
        seccabasi: id,
      },
    })
    .then((casiento) => {
      res.status(200).send(casiento);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar el asiento." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  cabasiento
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((cabasiento) => {
      res.status(200).send({ cabasiento });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar los asientos" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  cabasiento
    .findOne({
      where: {
        seccabasi: id,
      },
    })
    .then((casiento) => {
        casiento
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Asiento eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar el asiento" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar el asiento" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

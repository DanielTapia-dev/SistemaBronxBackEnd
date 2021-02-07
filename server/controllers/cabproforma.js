const cabproforma = require("../models").cabproforma;

function create(req, res) {
  cabproforma
    .create(req.body)
    .then((cabproforma) => {
      res.status(200).send({ cabproforma });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  cabproforma
    .findOne({
      where: {
        secmovcab: id,
      },
    })
    .then((proforma) => {
      proforma
        .update(body)
        .then(() => {
          res.status(200).send({ proforma });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar la proforma" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar la proforma" });
    });
}

function getOne(req, res) {
  var id = req.params.id;
  cabproforma
    .findOne({
      where: {
        secmovcab: id,
      },
    })
    .then((proforma) => {
      res.status(200).send(proforma);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la proforma." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  cabproforma
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((cabproforma) => {
      res.status(200).send({ cabproforma });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar los cabproforma" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  cabproforma
    .findOne({
      where: {
        secmovcab: id,
      },
    })
    .then((proforma) => {
      proforma
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Proforma eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la proforma" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la proforma" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

const cabmovfac = require("../models").cabmovfac;

function create(req, res) {
  cabmovfac
    .create(req.body)
    .then((cabmovfac) => {
      res.status(200).send({ cabmovfac });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  cabmovfac
    .findOne({
      where: {
        secmovcab: id,
      },
    })
    .then((movfactura) => {
        movfactura
        .update(body)
        .then(() => {
          res.status(200).send({ movfactura });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar la factura" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar la factura" });
    });
}

function getOne(req, res) {
  var id = req.params.id;
  cabmovfac
    .findOne({
      where: {
        secmovcab: id,
      },
    })
    .then((movfactura) => {
      res.status(200).send(movfactura);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar la factura." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  cabmovfac
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((cabmovfac) => {
      res.status(200).send({ cabmovfac });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar las facturas" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  cabmovfac
    .findOne({
      where: {
        secmovcab: id,
      },
    })
    .then((movfactura) => {
        movfactura
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Factura eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar la factura" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar la factura" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

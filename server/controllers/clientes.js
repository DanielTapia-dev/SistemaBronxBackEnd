const clientes = require("../models").clientes;

function create(req, res) {
  clientes
    .create(req.body)
    .then((clientes) => {
      res.status(200).send({ clientes });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  clientes
    .findOne({
      where: {
        idcliente: id,
      },
    })
    .then((cliente) => {
      cliente
        .update(body)
        .then(() => {
          res.status(200).send({ cliente });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar el cliente" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar el cliente" });
    });
}

function getOne(req, res) {
  clientes
    .findOne({
      where: {
        idcliente: req.body.cliente,
      },
    })
    .then((cliente) => {
      if (cliente) {
        if (req.body.token) {
          res.status(200).send({
            token: jwt.createToken(usuario),
            usuario: usuario,
          });
        } else {
          res.status(200).send({
            usuario: usuario,
          });
        }
      } else {
        res.status(401).send({ message: "Acceso no autorizado" });
      }
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar el Usuario." });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  clientes
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((clientes) => {
      res.status(200).send({ clientes });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar los clientes" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  clientes
    .findOne({
      where: {
        idcliente: id,
      },
    })
    .then((cliente) => {
      cliente
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Cliente eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar el cliente" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar el cliente" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
};

const producto = require("../models").producto;

function create(req, res) {
  producto
    .create(req.body)
    .then((producto) => {
      res.status(200).send({ producto });
    })
    .catch((err) => {
      res.status(500).send({ err });
    });
}

function update(req, res) {
  var id = req.params.id;
  var body = req.body;
  producto
    .findOne({
      where: {
        idproducto: id,
      },
    })
    .then((producto) => {
      producto
        .update(body)
        .then(() => {
          res.status(200).send({ producto });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al actualizar el producto" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al actualizar el producto" });
    });
}

function getOne(req, res) {
  var idproducto = req.params.id;
  producto
    .findOne({
      where: {
        idproducto: idproducto,
      },
    })
    .then((producto) => {
      res.status(200).send(producto);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrió un error al buscar el producto." + err });
    });
}

function getAll(req, res) {
  var idEmpresa = req.params.id;
  producto
    .findAll({
      where: {
        idempresa: idEmpresa,
      },
    })
    .then((producto) => {
      res.status(200).send({ producto });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al buscar los productos" });
    });
}

function borrar(req, res) {
  var id = req.params.id;
  var body = req.body;
  producto
    .findOne({
      where: {
        idproducto: id,
      },
    })
    .then((producto) => {
      producto
        .destroy(body)
        .then(() => {
          res.status(200).send({ message: "Producto eliminado" });
        })
        .catch((erro) => {
          res
            .status(500)
            .send({ message: "Ocurrio un error al borrar el producto" });
        });
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Ocurrio un error al borrar el producto" });
    });
}

module.exports = {
  create,
  update,
  getAll,
  borrar,
  getOne
}
